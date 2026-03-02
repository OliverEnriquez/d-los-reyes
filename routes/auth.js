const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ user: username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Credenciales inválidas' });
});

module.exports = router;
