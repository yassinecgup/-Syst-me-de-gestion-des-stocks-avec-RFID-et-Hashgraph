const mqtt = require('mqtt');
const config = require('./config');
const emailHandler = require('./emailHandler');
const contractManager = require('./contractManager');
const { payerFournisseur } = require('./hashgraph');


const pendingContracts = {};

const client = mqtt.connect({
  host: config.MQTT_BROKER,
  port: config.MQTT_PORT,
  username: config.MQTT_USERNAME,
  password: config.MQTT_PASSWORD,
  protocol: 'mqtts',
  rejectUnauthorized: false
});

client.on('connect', () => {
  console.log('[MQTT] Connecté au broker');
  client.subscribe(config.MQTT_TOPIC);
});

client.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    const { matiere, quantite } = payload;
    
    console.log(`[MQTT] Reçu : ${matiere} - ${quantite}`);

    if (quantite < config.SEUIL_STOCK) {
      console.log(`[ALERTE] ${matiere} < seuil`);
      const contract = contractManager.generateTempContract(matiere, quantite);
      pendingContracts[matiere] = contract;
      emailHandler.sendPriceRequest(matiere);
       // payerFournisseur(0.5); // 💸 Envoie le paiement
    }
  } catch (error) {
    console.error('Erreur de traitement du message MQTT:', error);
  }
});

client.on('error', (err) => {
  console.error('[MQTT] Erreur:', err);
});

function startMonitor() {
  // La connexion est déjà gérée par les événements
}

module.exports = {
  startMonitor,
  pendingContracts
};