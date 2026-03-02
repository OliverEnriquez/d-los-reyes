require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const createCrudRouter = require('./routes/crud');
const { regenerate } = require('./services/regenerate');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/stats', createCrudRouter('stats'));
app.use('/api/services', createCrudRouter('services'));
app.use('/api/gallery', createCrudRouter('gallery'));
app.use('/api/process', createCrudRouter('process_steps'));
app.use('/api/testimonials', createCrudRouter('testimonials'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api', require('./routes/messages'));

// Admin panel (production: serve built React app)
const adminDist = path.join(__dirname, 'admin', 'dist');
app.use('/admin', express.static(adminDist));
app.get('/admin/*', (req, res) => {
  const indexPath = path.join(adminDist, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('<h1>Admin panel not built yet</h1><p>Run: cd admin && npm run build</p>');
  }
});

// Public site
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Generate site on first start
regenerate();

app.listen(PORT, () => {
  console.log(`D' Los Reyes CMS running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
