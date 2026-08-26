import { Network } from "./network.js";
import { Node } from "./node.js";
import { config } from "./config.js";

const nodeIdEl = document.getElementById("node-id");
const chainEl = document.getElementById("chain");
const logEl = document.getElementById("log");
const dataInput = document.getElementById("data-input");
const mineBtn = document.getElementById("mine-btn");

function log(message) {

    const line = document.createElement("div");
    line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

    logEl.prepend(line);
}

function renderChain(chain) {

    chainEl.innerHTML = "";

    chain.forEach(block => {

        const item = document.createElement("li");

        item.textContent =
            `#${block.index} hash=${block.hash.slice(0, 10)}… ` +
            `prev=${block.previousHash.slice(0, 10)}… ` +
            `nonce=${block.nonce} ` +
            `data=${JSON.stringify(block.data)}`;

        chainEl.appendChild(item);
    });
}

const id = Math.random().toString(36).slice(2, 8);
nodeIdEl.textContent = id;
document.title = `Blockchain Node ${id}`;

const network = new Network();

network.onMessage(message => {
    if(message.type === "BLOCK")
        log(`network: block #${message.block.index} from ${message.senderId} arrived`);
});

const node = await Node.create(id, network);

node.onBlockAccepted = block => {
    renderChain(node.blockchain.chain);
    log(`accepted block #${block.index} into local chain`);
};

node.onBlockRejected = (block, senderId, reason) => {
    log(`rejected block #${block.index} from ${senderId}: inconsistent with local chain (${reason})`);
};

node.onChainReplaced = (senderId, previousLength, newLength) => {
    renderChain(node.blockchain.chain);
    log(`chain replaced (longest-chain rule): adopted ${newLength}-block chain from ${senderId}, replacing local ${previousLength}-block chain`);
};

renderChain(node.blockchain.chain);
log("node ready");

mineBtn.addEventListener("click", async () => {

    const data = dataInput.value || `block from ${id}`;

    mineBtn.disabled = true;
    log(`mining block (difficulty ${config.difficulty})…`);

    const started = performance.now();
    const block = await node.mineBlock({ text: data });
    const elapsedMs = Math.round(performance.now() - started);

    dataInput.value = "";
    renderChain(node.blockchain.chain);
    log(`mined block #${block.index} (nonce=${block.nonce}, ${elapsedMs}ms)`);
    mineBtn.disabled = false;
});
