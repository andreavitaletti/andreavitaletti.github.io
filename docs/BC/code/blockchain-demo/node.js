import { Block } from "./block.js";
import { Blockchain } from "./blockchain.js";
import { config } from "./config.js";

export class Node {

    constructor(id, blockchain, network) {

        this.id = id;
        this.blockchain = blockchain;
        this.network = network;

        this.network.onMessage(message => this.receive(message));
    }

    static async create(id, network) {

        const blockchain = await Blockchain.create();

        return new Node(id, blockchain, network);
    }

    async mineBlock(data) {

        const block = await this.blockchain.addBlock(data);

        this.network.broadcast({
            type: "BLOCK",
            block,
            chain: this.blockchain.chain,
            senderId: this.id
        });

        return block;
    }

    async receive(message) {

        switch(message.type) {

            case "BLOCK":
                await this.handleBlock(message.block, message.chain, message.senderId);
                break;
        }
    }

    async handleBlock(blockData, chainData, senderId) {

        const block = new Block(
            blockData.index,
            blockData.previousHash,
            blockData.timestamp,
            blockData.data,
            blockData.nonce,
            blockData.hash
        );

        const latest = this.blockchain.latestBlock();

        if(block.previousHash === latest.hash) {

            if(!(await block.isHashValid())) {
                this.onBlockRejected?.(block, senderId, "hash does not match its contents");
                return;
            }

            if(!block.meetsDifficulty(config.difficulty)) {
                this.onBlockRejected?.(block, senderId, "does not meet the required proof-of-work difficulty");
                return;
            }

            this.blockchain.chain.push(block);

            this.onBlockAccepted?.(block);
            return;
        }

        // Block doesn't extend our tip: this may be a fork. Fall back to the
        // longest-chain rule using the sender's full chain before giving up.
        const previousLength = this.blockchain.chain.length;

        if(await this.blockchain.replaceChain(chainData)) {
            this.onChainReplaced?.(senderId, previousLength, this.blockchain.chain.length);
            return;
        }

        this.onBlockRejected?.(block, senderId, "does not extend the local chain's tip");
    }
}
