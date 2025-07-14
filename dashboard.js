const express = require('express');
const path = require('path');
const stockMonitor = require('./stockMonitor');
const contractManager = require('./contractManager');
const hashgraphHandler = require('./hashgraphHandler');

const app = express();
const port = 3001;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Données locales
const finalizedContracts = [];

// Middleware pour parser le corps des requêtes
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('dashboard', {
    pendingContracts: Object.values(stockMonitor.pendingContracts),
    finalizedContracts
  });
});

app.post('/check-email', async (req, res) => {
  try {
    const matiere = "Fer";
    // Générer un prix entier entre 1 et 5 ℏ pour tester avec vos soldes
    const prix = Math.floor(Math.random() * 4 + 1); // 1-5 ℏ
    
    if (stockMonitor.pendingContracts[matiere]) {
      const quantite = stockMonitor.pendingContracts[matiere].quantite;
      
      // Vérifier que la quantité est raisonnable
      if (quantite <= 0 || quantite > 1000) {
        throw new Error(`Quantité invalide: ${quantite}`);
      }

      const contract = contractManager.finalizeContract(
        stockMonitor.pendingContracts[matiere], 
        prix
      );
      
      console.log(`[CONTRAT] ${quantite}x ${matiere} à ${prix} ℏ/unité = ${prix * quantite} ℏ total`);

      try {
        // Enregistrement du contrat
        const fileId = await hashgraphHandler.uploadContractToHashgraph(contract);
        console.log(`[HASHGRAPH] Contrat enregistré (ID: ${fileId})`);
        
        // Paiement
        await hashgraphHandler.payerFournisseur(contract);
        
        // Finalisation
        contract.file_id = fileId;
        finalizedContracts.push(contract);
        delete stockMonitor.pendingContracts[matiere];
        
        console.log(`[SUCCÈS] Commande finalisée pour ${matiere}`);
      } catch (error) {
        console.error(`[ERREUR] Transaction échouée pour ${matiere}:`, error.message);
      }
    }
    
    res.redirect('/');
  } catch (error) {
    console.error('Erreur critique:', error);
    res.status(500).send('Erreur serveur: ' + error.message);
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Tableau de bord disponible sur http://localhost:${port}`);
  stockMonitor.startMonitor();
});