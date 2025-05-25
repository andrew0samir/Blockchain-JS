class Block {
    constructor(index, timestamp, date, previoushash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.date = date;
        this.previoushash = previoushash;
    }
}