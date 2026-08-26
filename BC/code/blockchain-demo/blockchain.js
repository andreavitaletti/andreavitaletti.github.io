import { Block } from "./block.js";
import { config } from "./config.js";

export class Blockchain {

    constructor(genesisBlock) {
        this.chain = [genesisBlock];
    }

    static async create() {

        const genesis = await Block.create(0, "0", 0, { genesis: true });

        return new Blockchain(genesis);
    }

    latestBlock() {
        return this.chain[this.chain.length - 1];
    }

    async addBlock(data) {

        const prev = this.latestBlock();

        const block = await Block.mine(
            prev.index + 1,
            prev.hash,
            Date.now(),
            data,
            config.difficulty
        );

        this.chain.push(block);

        return block;
    }

    async isValid() {
        return Blockchain.isChainValid(this.chain);
    }

    static async isChainValid(chain) {

        for(let i = 1; i < chain.length; i++) {

            const current = chain[i];
            const previous = chain[i - 1];

            if(!(await current.isHashValid()))
                return false;

            if(current.previousHash !== previous.hash)
                return false;

            if(!current.meetsDifficulty(config.difficulty))
                return false;
        }

        return true;
    }

    // Longest-chain rule: adopt an incoming chain in place of ours if it is
    // both longer and valid. Used to resolve forks once a node hears about a
    // competing chain it can't just append a single block onto.
    async replaceChain(candidateBlocks) {

        if(candidateBlocks.length <= this.chain.length)
            return false;

        if(candidateBlocks[0].hash !== this.chain[0].hash)
            return false;

        const candidateChain = candidateBlocks.map(b => new Block(
            b.index,
            b.previousHash,
            b.timestamp,
            b.data,
            b.nonce,
            b.hash
        ));

        if(!(await Blockchain.isChainValid(candidateChain)))
            return false;

        this.chain = candidateChain;

        return true;
    }
}
