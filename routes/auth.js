const router = require('express').Router();
const jwt = require('jsonwebtoken');

const USERS = [
  { username: 'arianyenriquez', password: 'leonardo2016!' },
  { username: 'jesusreyes', password: 'leonardo2016!' },
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username.toLowerCase().trim() && u.password === password);
  if (user) {
    const token = jwt.sign({ user: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
});

module.exports = router;
