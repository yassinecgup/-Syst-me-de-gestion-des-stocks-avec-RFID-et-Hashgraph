function generateTempContract(matiere, quantite) {
  return {
    matiere: matiere,
    quantite: quantite,
    prix_provisoire: "En attente",
    valide: false
  };
}

function finalizeContract(tempContract, prix) {
  tempContract.prix = prix;
  tempContract.valide = true;
  return tempContract;
  const { payerFournisseur } = require('./hashgraph');

}

module.exports = {
  generateTempContract,
  finalizeContract
};