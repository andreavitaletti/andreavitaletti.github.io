import { config } from "./config.js";

export class Network {

    constructor(channelName = config.channelName) {

        this.channel = new BroadcastChannel(channelName);
        this.listeners = [];

        this.channel.onmessage = event => {

            const delay = Math.random() * config.maxNetworkDelayMs;

            setTimeout(() => {
                this.listeners.forEach(listener => listener(event.data));
            }, delay);
        };
    }

    onMessage(listener) {
        this.listeners.push(listener);
    }

    broadcast(message) {
        this.channel.postMessage(message);
    }
}
