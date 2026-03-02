const db = require('../db/database');
const auth = require('../middleware/auth');
const { regenerate } = require('../services/regenerate');

function createCrudRouter(tableName, fields) {
  const router = require('express').Router();

  router.get('/', (req, res) => {
    const data = db.load();
    const items = (data[tableName] || []).sort((a, b) => a.sort_order - b.sort_order);
    res.json(items);
  });

  router.post('/', auth, (req, res) => {
    const data = db.load();
    const id = db.getNextId(data, tableName);
    const item = { id, sort_order: (data[tableName] || []).length, ...req.body };
    data[tableName] = data[tableName] || [];
    data[tableName].push(item);
    db.save(data);
    regenerate();
    res.status(201).json(item);
  });

  router.put('/reorder', auth, (req, res) => {
    const data = db.load();
    const order = req.body; // [{ id, sort_order }]
    order.forEach(({ id, sort_order }) => {
      const item = data[tableName].find(i => i.id === id);
      if (item) item.sort_order = sort_order;
    });
    db.save(data);
    regenerate();
    res.json({ success: true });
  });

  router.put('/:id', auth, (req, res) => {
    const id = parseInt(req.params.id);
    const data = db.load();
    const item = data[tableName].find(i => i.id === id);
    if (!item) return res.status(404).json({ error: 'No encontrado' });
    Object.assign(item, req.body, { id });
    db.save(data);
    regenerate();
    res.json(item);
  });

  router.delete('/:id', auth, (req, res) => {
    const id = parseInt(req.params.id);
    const data = db.load();
    data[tableName] = data[tableName].filter(i => i.id !== id);
    db.save(data);
    regenerate();
    res.json({ success: true });
  });

  return router;
}

module.exports = createCrudRouter;
