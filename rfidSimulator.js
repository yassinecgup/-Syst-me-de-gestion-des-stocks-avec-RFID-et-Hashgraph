const mqtt = require('mqtt');
const config = require('./config');

const client = mqtt.connect({
  host: config.MQTT_BROKER,
  port: config.MQTT_PORT,
  username: config.MQTT_USERNAME,
  password: config.MQTT_PASSWORD,
  protocol: 'mqtts',
  rejectUnauthorized: false

});

const matieres = ["Fer"];

function simulateRfid() {
  setInterval(() => {
    matieres.forEach(mat => {
      const quantite = Math.floor(Math.random() * 41) + 10; // 10-50
      const payload = JSON.stringify({ matiere: mat, quantite });
      client.publish(config.MQTT_TOPIC, payload);
      console.log(`[RFID] Publié : ${payload}`);
    });
  }, 2000);
}

client.on('connect', () => {
  console.log('[MQTT] Connecté au broker');
  simulateRfid();
});

client.on('error', (err) => {
  console.error('[MQTT] Erreur:', err);
});