
// importing the encryption functions that will be used 
// here we use sha256 to calculate the hashes
const SHA256 = require('crypto-js/sha256');

// transaction class control how the transactions look like
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

// initialize blocks that go into our block chain
// the hash used to reference blocks   
class Block {
    // removed the index cause its the position is not controlled bu the index anymore
    // changed the data argument into transations 
    constructor(timestamp, transactions, previoushash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    // we use sha256 method to return hash containing the encrypted data
    // through calculatehash method to generate unique hash for each block
    calculateHash() {
        return SHA256(this.index + this.previoushash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // this method is added to ensure the prof of work 
    // as in real world to get new block this require compution power which called mining
    // the difficulty determine the number of Zero's at the start of the hash
    // this prevent spammer to add fake new block to the chain
    mineBlock(difficulty) {
        // this is infinte loop basicaly so we need to add nonce to the hash 
        // nonce is just a random number added to not change any important data for the block
        // to be able to reach break point 
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("block mined: ", this.hash);
    }

}

// initialize the blockchain itself 
// the blockchain have methods to add new blocks and verify blocks ...etc
// in reality we cant just add new block to the chain this easy
// cause there must be alot of checks and conditions 
// to verify the integrity of the block and after validatation add the new block 
class Blockchain {
    constructor() {
        // the constructor responsible for initializing the chain 
        // the chain should be empty at first but
        // we add the fundamental genesis block manually into the chain 
        this.chain = [this.createGenesisBlock()];

        // this is the difficulty that control how many Zeros needed to be added to the hash 
        this.difficulty = 2;

        // this is responsable for saving the pending transactions between the intervals 
        // of mining blocks and added blocks into the blockchain
        this.pendingTransactions = [];

        // this control how much the miner gets as rewards
        this.miningReward = 100;
    }

    // this method generate the first block in the chain 
    // first ever block in the chain usually called genesis block 
    // genesis block is the fundamental block 
    // it's the only block that have no previous hash (no data optionaly) 
    createGenesisBlock() {
        return new Block("25/5/2025", "Genesis block", "0")
    }

    // method return the last block in the chain 
    getLatestBlock() {
        // return the last item in the array 
        return this.chain[this.chain.length - 1];
    }

    // removed the old way to mine
    // this take address to add the reward to
    minePendingTransactions(miningRewardAddress) {
        // in real cryptocurrency adding all the pending transactions is impossible
        // there are way too many transactions to be added to a block 
        // cause the block size cant exceed 1 MB
        // miners should be able to choose which transction to be added in real life
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined");
        this.chain.push(block);

        // after adding the block to the chain 
        // reset the transations and give the miner his reward
        this.pendingTransactions = [
            // dont need from address cause the system is the one giving the reward
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    // to get the balance you check all the transactions that envolve your address and calculate it
    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    // simple method retun true or flase to check if the chain valid
    isChainValid() {
        // loop over the chain to check all blocks 
        // ignore block 0 cause its fixed in chain (gensis block)
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // check if the hash of the block is vaild 
            // this match the hash by recalculating the hash for the same properties
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // check if the block points to correct previous block
            // this checks if the block pointing at some block that may not exists
            if (currentBlock.previoushash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }

}

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
