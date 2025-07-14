Système de Gestion des Stocks avec RFID et Hashgraph

Un système innovant de gestion des stocks qui combine la technologie RFID pour le suivi des articles et la blockchain Hashgraph pour des transactions sécurisées et vérifiables.

Fonctionnalités Principales
🏷 Suivi en temps réel des niveaux de stock via RFID

⚡ Alertes automatiques lorsque le stock est bas

📧 Communication automatisée avec les fournisseurs

💰 Paiements sécurisés via la blockchain Hedera Hashgraph

📊 Tableau de bord intuitif pour le suivi des transactions



    Prérequis
Node.js v16+

Compte Hedera Hashgraph

Accès à un broker MQTT (ex: HiveMQ Cloud)

Compte email SMTP (ex: Ethereal Email pour le test)

Installation
Cloner le dépôt:

bash
git clone https://github.com/yassinecgup/Syst-me-de-gestion-des-stocks-avec-RFID-et-Hashgraph.git
cd Syst-me-de-gestion-des-stocks-avec-RFID-et-Hashgraph
Installer les dépendances:

bash
npm install
Configurer les variables d'environnement:

bash
cp config.example.js config.js
Editez config.js avec vos identifiants.

Utilisation
Lancer les différents services dans des terminaux séparés:

bash
-terminal1
node dashboard.js

-terminal2
node rfidSimulator.js

-terminal3
node supplierSimulator.js
Accéder au tableau de bord: http://localhost:3001


Configuration Hedera
Créez un compte testnet sur Hedera Portal

Obtenez des HBAR testnet via le faucet

Configurez vos identifiants dans config.js:

javascript
{
  MY_HASHGRAPH_ID: "0.0.XXXXXXX",
  MY_HASHGRAPH_PRIVATE_KEY: "302...",
  FOURNISSEUR_HASHGRAPH_ID: "0.0.XXXXXXX"
}
Contribuer
Les contributions sont les bienvenues! Suivez ces étapes:

Forkez le projet

Créez une branche (git checkout -b feature/AmazingFeature)

Committez vos changements (git commit -m 'Add some AmazingFeature')

Pushez vers la branche (git push origin feature/AmazingFeature)

Ouvrez une Pull Request

Licence
Distribué sous licence MIT. Voir LICENSE pour plus d'informations.

Contact
Yassine Jammal - yassine.jammal20@gmail.com


