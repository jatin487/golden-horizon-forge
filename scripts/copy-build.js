const fs = require('fs');

if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}

fs.cpSync('.output/public', 'dist/client', { recursive: true });
