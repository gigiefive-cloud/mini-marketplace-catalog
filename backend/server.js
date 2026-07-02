const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Mini Marketplace Catalog API berjalan di http://localhost:${PORT}`);
});
