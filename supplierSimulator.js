const emailHandler = require('./emailHandler');
const config = require('./config');

const matieres = ["fer"];

function simulateSupplier() {
  setInterval(() => {
    const mat = matieres[Math.floor(Math.random() * matieres.length)];
    const prix = (Math.random() * 40 + 10).toFixed(2);
    console.log(`[SUPPLIER] Envoi prix ${mat}: ${prix} MAD`);
    emailHandler.sendPriceReply(mat, prix);
  }, 10000);
}

simulateSupplier();