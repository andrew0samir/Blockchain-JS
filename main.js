const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previoushash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
    }
    calculateHash() {
        return SHA256(this.index + this.previoushash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}
