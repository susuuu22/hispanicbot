const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot activo y funcionando.');
});

function keepAlive() {
  app.listen(3000, () => {
    console.log('🌐 Servidor Express iniciado en el puerto 3000');
  });
}

module.exports = keepAlive;
