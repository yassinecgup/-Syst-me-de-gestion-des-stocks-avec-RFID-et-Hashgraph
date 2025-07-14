const { Client, FileCreateTransaction, PrivateKey, AccountId, TransferTransaction, Hbar, AccountBalanceQuery } = require("@hashgraph/sdk");
const config = require('./config');

const client = Client.forTestnet();
client.setOperator(
  AccountId.fromString(config.MY_HASHGRAPH_ID),
  PrivateKey.fromString(config.MY_HASHGRAPH_PRIVATE_KEY)
);

async function payerFournisseur(contract) {
  try {
    // Calculer le montant en tinybars (1 ℏ = 100,000,000 tinybars)
    const montantTinybars = Math.round(contract.prix * contract.quantite * 100000000);
    const montantHbar = Hbar.fromTinybars(montantTinybars);

    // Vérification approfondie du solde
    const myBalance = await new AccountBalanceQuery()
      .setAccountId(config.MY_HASHGRAPH_ID)
      .execute(client);

    const fournisseurBalance = await new AccountBalanceQuery()
      .setAccountId(config.FOURNISSEUR_HASHGRAPH_ID)
      .execute(client);

    console.log(`[SOLDE] Votre compte (${config.MY_HASHGRAPH_ID}): ${myBalance.hbars.toString()}`);
    console.log(`[SOLDE] Fournisseur (${config.FOURNISSEUR_HASHGRAPH_ID}): ${fournisseurBalance.hbars.toString()}`);

    // Vérifier que le montant est valide
    if (montantTinybars <= 0) {
      throw new Error(`Montant invalide: ${montantHbar.toString()}`);
    }

    if (myBalance.hbars.toTinybars().lt(montantTinybars)) {
      throw new Error(`Solde insuffisant. Nécessaire: ${montantHbar.toString()}, Disponible: ${myBalance.hbars.toString()}`);
    }

    console.log(`[TRANSACTION] Préparation du transfert de ${montantHbar.toString()}`);

    const transaction = new TransferTransaction()
      .addHbarTransfer(
        AccountId.fromString(config.MY_HASHGRAPH_ID), 
        montantHbar.negated()
      )
      .addHbarTransfer(
        AccountId.fromString(config.FOURNISSEUR_HASHGRAPH_ID), 
        montantHbar
      )
      .setTransactionMemo(`Paiement pour ${contract.quantite}x ${contract.matiere}`)
      .setMaxTransactionFee(new Hbar(1)); // Frais limités à 1 ℏ

    // Exécuter la transaction
    const response = await transaction.execute(client);
    const receipt = await response.getReceipt(client);
    
    console.log(`[SUCCÈS] ${montantHbar.toString()} transféré avec succès (${receipt.status.toString()})`);
    return receipt;
  } catch (error) {
    console.error('[ERREUR] Échec du paiement:', error.message);
    throw error;
  }
}

async function uploadContractToHashgraph(contract) {
  try {
    const transaction = new FileCreateTransaction()
      .setContents(JSON.stringify(contract))
      .setMaxTransactionFee(new Hbar(1)); // Limite les frais
    
    const response = await transaction.execute(client);
    const receipt = await response.getReceipt(client);
    const fileId = receipt.fileId.toString();
    
    console.log(`[Hashgraph] Contrat stocké avec ID : ${fileId}`);
    return fileId;
  } catch (error) {
    console.error('Erreur lors de l\'upload du contrat:', error);
    throw error;
  }
}

module.exports = {
  uploadContractToHashgraph,
  payerFournisseur,
};