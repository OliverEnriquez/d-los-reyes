const router = require('express').Router();
const db = require('../db/database');
const auth = require('../middleware/auth');

// Public: submit contact form
router.post('/contact', (req, res) => {
  const { name, phone, email, project_type, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Campos requeridos: name, email, message' });

  const data = db.load();
  const id = db.getNextId(data, 'messages');
  const msg = { id, name, phone: phone || '', email, project_type: project_type || '', message, read: false, created_at: new Date().toISOString() };
  data.messages.push(msg);
  db.save(data);
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
