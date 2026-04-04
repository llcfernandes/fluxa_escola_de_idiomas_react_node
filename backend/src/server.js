// server.js
require('dotenv').config();
const app  = require('./app');
const seed = require('./config/seed');

const PORT = process.env.PORT || 3001;

(async () => {
  await seed(); // Gera hashes reais ANTES de ouvir requisições
  app.listen(PORT, () => {
    console.log(`\n🚀 Fluxa API em http://localhost:${PORT}`);
    console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}\n`);
  });
})();
