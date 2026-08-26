# Blockchain fork & proof-of-work demo

A small, dependency-free blockchain that runs entirely in the browser.
Each **browser tab** is an independent node: nodes talk to each other over
the [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)
API (same-origin cross-tab messaging), mine blocks with a real (tiny)
proof-of-work, and resolve competing chains with the longest-chain rule.

<iframe src="../code/blockchain-demo/index.html" width="100%" height="750" style="border:1px solid #ccc;"></iframe>

## Try it with multiple nodes

`BroadcastChannel` is scoped to the whole site origin, not to this one
embedded frame, so you can get several independent nodes talking to each
other either way:

* open **this page** in two or more browser tabs, or
* open the demo directly, outside the frame, at
  [`code/blockchain-demo/index.html`](code/blockchain-demo/index.html), in
  two or more tabs.

Mining a block in one tab should show up in the others after a short
simulated network delay — watch the "Network log" section.

## What it demonstrates

* **Async hashing** — block hashes are computed with the browser's native
  `crypto.subtle.digest` (Web Crypto), which is asynchronous.
* **Simulated network latency** — incoming messages are delivered after a
  random delay, so tabs behave like nodes talking over a slow/unreliable
  network rather than making instantaneous local calls.
* **Proof of work** — mining repeatedly re-hashes a block with an
  incrementing nonce until the hash has enough leading zero hex digits.
  "Mine block" is disabled while this runs and reports how long it took.
* **Forks and the longest-chain rule** — if two nodes mine a block on the
  same tip before hearing about each other, both reject each other's
  block and diverge. Whichever branch is extended further eventually wins:
  once a node hears about a chain longer than its own (and valid), it
  discards its own chain and adopts that one.

All of these knobs (simulated network delay, proof-of-work difficulty) live
in one place in the demo's `config.js`, so they're easy to tune to make
forks easier or harder to trigger.

## Trigger a fork on purpose

1. Open three tabs of the demo. Confirm all three show the same single
   genesis entry in "Chain".
2. In two of the tabs, type some data and click "Mine block" in both
   **as close together as possible**.
3. Wait for the simulated network delay to settle, then check each tab's
   chain: the two that mined will have kept their *own* block, and the
   third will have adopted whichever arrived first — a fork.
4. Keep mining in one of the forked tabs (or the third one) until its
   chain is longer than the other branch. Watch the losing tab's log: once
   a longer, valid chain arrives, it logs a "chain replaced (longest-chain
   rule)" message and adopts it. Give it another round of network delay and
   all tabs converge on the same chain.
