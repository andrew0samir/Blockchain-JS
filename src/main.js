const { Blockchain, Transaction } = require("./blockchain");

// for testing the address and transactions
let andrewCoin = new Blockchain();

andrewCoin.createTransaction(new Transaction('address1', 'address2', 100));
andrewCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log("\n starting the miner");
andrewCoin.minePendingTransactions("andrew-address");

console.log("\n balance of andrew is ", andrewCoin.getBalanceOfAddress("andrew-address"));

console.log("\n starting the miner");
andrewCoin.minePendingTransactions("andrew-address");

console.log("\n balance of andrew is ", andrewCoin.getBalanceOfAddress("andrew-address"));
