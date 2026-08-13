import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { exec } from 'node:child_process'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'save-portfolio-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'POST' && req.url === '/api/save-portfolio') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                // Save to public/portfolio-data.json
                const filePath = path.resolve(__dirname, 'public/portfolio-data.json');
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
                // Regenerate English translations from the (possibly edited)
                // Spanish source of truth so the language switch stays in sync.
                exec('npm run translate --silent', { cwd: __dirname }, (err, stdout) => {
                  if (err) {
                    console.error('translate after save failed:', err.message);
                  } else {
                    console.log(stdout.trim());
                  }
                });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
})

