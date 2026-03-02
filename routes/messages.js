const router = require('express').Router();
const db = require('../db/database');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendNotification(msg) {
  if (!process.env.SMTP_USER) return;
  const emails = process.env.SMTP_USER;

  const html = `
    <h2>Nuevo mensaje de contacto - D' Los Reyes</h2>
    <table style="border-collapse:collapse;width:100%;max-width:500px;">
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Nombre</td><td style="padding:8px;border-bottom:1px solid #eee;">${msg.name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${msg.email}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Teléfono</td><td style="padding:8px;border-bottom:1px solid #eee;">${msg.phone || 'No proporcionado'}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Tipo de proyecto</td><td style="padding:8px;border-bottom:1px solid #eee;">${msg.project_type || 'No especificado'}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Mensaje</td><td style="padding:8px;">${msg.message}</td></tr>
    </table>
  `;

  try {
    await transporter.sendMail({
      from: `"D' Los Reyes Web" <${process.env.SMTP_USER}>`,
      to: emails,
      subject: `Nuevo mensaje de ${msg.name} - D' Los Reyes`,
      html,
    });
  } catch (err) {
    console.error('Error enviando email:', err.message);
  }
}

// Public: submit contact form
router.post('/contact', (req, res) => {
  const { name, phone, email, project_type, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Campos requeridos: name, email, message' });

  const data = db.load();
  const id = db.getNextId(data, 'messages');
  const msg = { id, name, phone: phone || '', email, project_type: project_type || '', message, read: false, created_at: new Date().toISOString() };
  data.messages.push(msg);
  db.save(data);

  sendNotification(msg);

  res.status(201).json({ success: true });
});

// Admin: list messages
router.get('/messages', auth, (req, res) => {
  const data = db.load();
  res.json(data.messages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

// Admin: mark as read
router.put('/messages/:id/read', auth, (req, res) => {
  const id = parseInt(req.params.id);
  const data = db.load();
  const msg = data.messages.find(m => m.id === id);
  if (!msg) return res.status(404).json({ error: 'No encontrado' });
  msg.read = true;
  db.save(data);
  res.json(msg);
});

module.exports = router;
