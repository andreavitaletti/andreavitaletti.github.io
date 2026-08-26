export class Block {
    constructor(index, previousHash, timestamp, data, nonce, hash) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.nonce = nonce;
        this.hash = hash;
    }

    static async computeHash(index, previousHash, timestamp, data, nonce) {

        const payload = index + previousHash + timestamp + JSON.stringify(data) + nonce;
        const encoded = new TextEncoder().encode(payload);
        const digest = await crypto.subtle.digest("SHA-256", encoded);

        return Array.from(new Uint8Array(digest))
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");
    }

    static hashMeetsDifficulty(hash, difficulty) {
        return hash.startsWith("0".repeat(difficulty));
    }

    static async create(index, previousHash, timestamp, data, nonce = 0) {

        const hash = await Block.computeHash(index, previousHash, timestamp, data, nonce);

        return new Block(index, previousHash, timestamp, data, nonce, hash);
    }

    static async mine(index, previousHash, timestamp, data, difficulty) {

        let nonce = 0;
        let hash = await Block.computeHash(index, previousHash, timestamp, data, nonce);

        while(!Block.hashMeetsDifficulty(hash, difficulty)) {
            nonce++;
            hash = await Block.computeHash(index, previousHash, timestamp, data, nonce);
        }

        return new Block(index, previousHash, timestamp, data, nonce, hash);
    }

    async isHashValid() {

        const recomputed = await Block.computeHash(
            this.index,
            this.previousHash,
            this.timestamp,
            this.data,
            this.nonce
        );

        return recomputed === this.hash;
    }

    meetsDifficulty(difficulty) {
        return Block.hashMeetsDifficulty(this.hash, difficulty);
    }
}
