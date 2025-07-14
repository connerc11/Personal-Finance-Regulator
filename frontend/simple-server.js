const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  let filePath;
  
  // Handle static assets first (CSS, JS, images, etc.)
  if (req.url.startsWith('/static/') || req.url.includes('.')) {
    filePath = path.join(__dirname, 'build', req.url);
    
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          res.writeHead(500);
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000'
          });
          res.end(data);
        }
      });
      return;
    }
  }
  
  // For all other requests (React Router routes), serve index.html
  filePath = path.join(__dirname, 'build', 'index.html');
  
  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Error reading index.html:', err);
        res.writeHead(500);
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(data);
      }
    });
  } else {
    console.error('index.html not found at:', filePath);
    res.writeHead(404);
    res.end('Build directory not found. Please run npm run build first.');
  }
});

server.listen(port, () => {
  console.log(`React app running at http://localhost:${port}`);
});
