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
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

// Simple development server that serves index.html for all routes
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Always serve index.html for React Router
  // The React dev server will handle the actual routing
  const indexPath = path.join(__dirname, 'build', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    fs.readFile(indexPath, (err, data) => {
      if (err) {
        console.error('Error reading index.html:', err);
        res.writeHead(500);
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        res.end(data);
      }
    });
  } else {
    console.error('index.html not found at:', indexPath);
    res.writeHead(404);
    res.end(`
      <html>
        <body>
          <h1>Build not found</h1>
          <p>Please run 'npm run build' first, or use 'npm start' for development.</p>
          <p>Looking for: ${indexPath}</p>
        </body>
      </html>
    `);
  }
});

server.listen(port, () => {
  console.log(`React app running at http://localhost:${port}`);
  console.log(`Serving from: ${path.join(__dirname, 'build')}`);
});
