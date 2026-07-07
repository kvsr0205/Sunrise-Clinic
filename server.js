const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Serve static assets with long-lived cache headers
app.use(
  '/assets',
  express.static(path.join(PUBLIC_DIR, 'assets'), {
    maxAge: '1y',
    immutable: true,
  })
);

// Serve other static files (favicon, etc.) without aggressive caching
app.use(express.static(PUBLIC_DIR, { maxAge: '1h' }));

// SPA fallback — send index.html for all unmatched routes
app.get('*', (req, res) => {
  const indexPath = path.join(PUBLIC_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(500).send('index.html not found. Make sure the public/ folder is present.');
  }
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Sunrise Clinic server running at http://localhost:${PORT}`);
});
