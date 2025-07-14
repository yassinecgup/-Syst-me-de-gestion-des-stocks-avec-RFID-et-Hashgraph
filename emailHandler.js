const nodemailer = require('nodemailer');
const config = require('./config');

// Dictionnaire pour stocker le dernier envoi par matière
const lastSentTimestamps = {}; // ex : { "Fer": 1723481712000 }

const cooldownMs = 60 * 1000; // 1 minute de cooldown entre deux emails pour la même matière

const transporter = nodemailer.createTransport({
  host: config.EMAIL_SMTP,
  port: config.EMAIL_PORT,
  secure: false,
  auth: {
    user: config.EMAIL_ADDRESS,
    pass: config.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

function canSendEmailFor(matiere) {
  const now = Date.now();
  const lastSent = lastSentTimestamps[matiere] || 0;
  return (now - lastSent) > cooldownMs;
}

async function sendPriceRequest(matiere) {
  if (!canSendEmailFor(matiere)) {
    console.log(`[EMAIL SKIPPÉ] Trop tôt pour renvoyer un email pour ${matiere}`);
    return;
  }

  const mailOptions = {
    from: config.EMAIL_ADDRESS,
    to: config.EMAIL_TO,
    subject: `Demande de prix - ${matiere}`,
    text: `Demande de prix pour ${matiere}`
  };

  try {
    await transporter.sendMail(mailOptions);
    lastSentTimestamps[matiere] = Date.now(); // mettre à jour le timestamp
    console.log(`[Email] Demande envoyée au fournisseur pour ${matiere}`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
}

async function sendPriceReply(matiere, prix) {
  const mailOptions = {
    from: config.EMAIL_ADDRESS,
    to: config.EMAIL_ADDRESS,
    subject: `Réponse de prix - ${matiere}`,
    text: `Prix pour ${matiere}: ${prix}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Fournisseur] Réponse envoyée: ${matiere} à ${prix} MAD`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
}

module.exports = {
  sendPriceRequest,
  sendPriceReply,
   transporter
};
