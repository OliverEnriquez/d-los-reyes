const router = require('express').Router();
const db = require('../db/database');
const auth = require('../middleware/auth');
const { regenerate } = require('../services/regenerate');

const VALID_SECTIONS = ['hero', 'about', 'cta', 'contact', 'footer', 'settings', 'services_header', 'gallery_header', 'process_header', 'testimonials_header'];

router.get('/:section', (req, res) => {
  const { section } = req.params;
  if (!VALID_SECTIONS.includes(section)) return res.status(400).json({ error: 'Sección inválida' });
  const data = db.load();
  res.json({ section, data: data.content[section] });
});

function cleanNbsp(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].replace(/&nbsp;/g, ' ');
    }
  }
  return obj;
}

router.put('/:section', auth, (req, res) => {
  const { section } = req.params;
  if (!VALID_SECTIONS.includes(section)) return res.status(400).json({ error: 'Sección inválida' });
  const data = db.load();
  const existing = data.content[section] || {};
  data.content[section] = { ...existing, ...cleanNbsp(req.body) };
  db.save(data);
  regenerate();
  res.json({ section, data: data.content[section] });
});

module.exports = router;
