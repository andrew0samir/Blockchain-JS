
// importing the encryption functions that will be used 
// here we use sha256 to calculate the hashes
const SHA256 = require('crypto-js/sha256');

// initialize blocks that go into our block chain
// the hash used to reference blocks   
class Block {
    constructor(index, timestamp, data, previoushash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
    }

    // we use sha256 method to return hash containing the encrypted data
    // through calculatehash method to generate unique hash for each block
    calculateHash() {
        return SHA256(this.index + this.previoushash + this.timestamp + JSON.stringify(this.data)).toString();
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
    }

    // this method generate the first block in the chain 
    // first ever block in the chain usually called genesis block 
    // genesis block is the fundamental block 
    // it's the only block that have no previous hash (no data optionaly) 
    createGenesisBlock() {
        return new Block(0, "25/5/2025", "Genesis block", "0")
    }

    // method return the last block in the chain 
    getLatestBlock() {
        // return the last item in the array 
        return this.chain[this.chain.length - 1];
    }

    // method add new block into the chain 
    addBlock(newBlock) {
        // set the previous hash to the hash of the last block 
        newBlock.previoushash = this.getLatestBlock().hash;
        // recalculate the hash for the block it self to update the hash 
        newBlock.hash = newBlock.calculateHash();
        // push the new block to the chain 
        this.chain.push(newBlock);
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

//  to test it :
//      create instance 
//      add new blocks
let andrewCoin = new Blockchain();
andrewCoin.addBlock(new Block(1, "1/6/2025", { amount: 5 }));
andrewCoin.addBlock(new Block(2, "5/6/2025", { amount: 10 }));

console.log('is blockchain valid?', andrewCoin.isChainValid()); // true

// this try to change the block 
andrewCoin.chain[1].data = { amount: 100 };
andrewCoin.chain[1].hash = andrewCoin.chain[1].calculateHash();

console.log('is blockchain valid?', andrewCoin.isChainValid()); // false 

// console.log(JSON.stringify(andrewCoin, null, 4));
