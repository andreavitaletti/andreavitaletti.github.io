
# Thesis

## A browser plugin to validate the proof of a legit transformation of a private image into a public available one publicly available on the Web

The Internet has plenty of public images that are transformations (e.g., resize, crop, grayscale) of original unpublished ones. Various reasons recommend to keep private an original image, such as its economic value and its sensitive content. Several concrete scenarios, including selling images over the Internet, fighting misinformation and detecting deep fakes, would highly benefit from a system allowing to efficiently prove and verify the authenticity of a transformed image (i.e., the public image is a result of a faithful transformation over a private and authentic original image). We have designed a system allowing the possessor of a signed private image to compute a faithful transformation, guaranteeing 1) confidentiality (no leak), 2) efficient proof generation (the proof can be computed with a cheap laptop), 3) integrity (only the advertised transformations have been applied) and 4) efficient fraud detection (fast detection of bogus proofs). Our system is based on a divide-et-impera approach through sub-transformations applied to tiles of the original image that are then reconnected together along with their sub-proofs. [see Do Not Trust Anybody: ZK Proofs for Image Transformations Tile by Tile on Your Laptop on RWC](https://rwc.iacr.org/2024/program.php).

A detailed paper on the technical ingredients to develop the system will be provided 

### Goal of the thesis.

Develop a plugin for a browser capable to verify that the publicly available image shown in the browser is indeed obtained from a legit transformation of a private image owned by a possessor. Similarly to what happens in TLS, browsers show a closed lock when the communication is secure and the server is known, the plugin should show a symbol to show that the browser has validated the proof. 

### Technical Ingredients:

The proof require some knowledge of Zero Knowledge Proofs and the tools to implement such proofs (e.g. [Circom](https://docs.circom.io/)) as well as the capability to develop browser plugins. The thesis should also consider the compliance with the C2PA standard.

### Links

* https://c2pa.org/
* https://chromewebstore.google.com/detail/c2pa-content-credentials/mjkaocdlpjmphfkjndocehcdhbigaafp
* https://contentcredentials.org/verify
* https://github.com/contentauth/c2patool?tab=readme-ov-file
* https://github.com/digimarc-corp/c2pa-content-credentials-extension
* https://github.com/contentauth/c2pa-js
* https://opensource.contentauthenticity.org/docs/manifest/manifest-examples/
* https://github.com/c2pa-org/public-testfiles/tree/main/image

## Conflict-Free Replicated Data in Web3 and Blockchain

Conflict-Free Replicated Data Type (CRDT) is a data structure which allows multiple replicas to be updated independently and concurrently without the need for synchronization. The key feature of CRDT is that it ensures strong eventual consistency across all replicas, making it a preferred solution for distributed databases and systems.

Eventual Consistency is a guarantee that when an update is made in a distributed node, that update will eventually be reflected in all nodes that store the data, resulting in the same response every time the data is queried.

CRDT have been used in nosql key-value databases such as [REDIS](https://redis.io/blog/diving-into-crdts/), in decentralized social such as [farcaster](https://github.com/farcasterxyz/protocol/blob/main/docs/SPECIFICATION.md) and reently they have been proposed to implement an [Orderless Blockchain](https://arxiv.org/pdf/2210.01477)

### Goal of the thesis

The thesis will first analyse the CRDT data structures and then it will focus in their employment in one of the above cited application domain (or even new ones) with
the purpose of developing a PoC or improving current solutions

## Blockchain for the Circular Economy

The circular economy is a model of production and consumption, which involves sharing, leasing, reusing, repairing, refurbishing and recycling existing materials and products as long as possible. In this way, the life cycle of products is extended. Keeping track of all those transformation in the state of materials and products is a key to support [Circular Economy and Blockchain](https://www.sciencedirect.com/science/article/pii/S2667378922000633) is claimed to be a reference solution both to keep track of such changes of state and to possibly facilitate the circular economy dispensing proper incentives to actors that behave properly. 

### Goal of the thesis
We are partner in the PNRR Made in Italy Circolare e Sostenibile [MICS](https://www.mics.tech/en/home/) project. 

The purpose of the thesis is to develop a PoC on the employment of Blockchain Technologies to support the Circular Economy in the Made in Italy

## Federated Machine Learning and Blockchain

[Federated learning](https://link.springer.com/article/10.1007/s13042-022-01647-y)(FML) is a decentralized approach to training machine learning models. It doesn't require an exchange of data from client devices to global servers. Instead, the raw data on edge devices is used to train the model locally, and share only model parameters thus increasing data privacy.

### Goal of the thesis

The thesis will investigate the integration of FML with Blockchain Technologies starting from the relevant [literature](https://dl.acm.org/doi/10.1145/3570953). We are particularly interested in designing new tools and methodology to automatically compensate, by means of smart contracts, the contribution of each distributed node to the distillation of the global model. To this purpose, we first need to identify a privacy-preserving metric to evaluate the [quality](https://research.ece.cmu.edu/lions/Papers/Federated_WiOpt.pdf) of the contribution [without revealing the data](https://arxiv.org/abs/2108.10623). 

## Blockchain-based solutions for trusted and quality-aware data sharing

Monitoring business processes within complex supply chains demands efficient data collection and analytics tailored to diverse phenomena. Traditional centralized solutions face limitations in adapting to the dynamic nature of supply chains. This calls for [distributed solutions](https://dlt2024.di.unito.it/wp-content/uploads/2024/05/DLT2024_paper_60.pdf) which break
the usual architectural assumption to have a central entity in charge of collecting, integrating and offering tools for the analysis.

### Goal of the thesis

The thesis aims at develop tools and methodology to proofs in zero knowledge that sensitive business data are compliant to specific criteria- Since data are sensitive they cannot be disclosed (zero-knowledge), but the company is interested to provide formal evidences (i.e. proofs) that it is compliant to specific criteria and/or standards. As an example, given a public available reference vector of features, the company what to provide a proof that its private features are within a given distance (e.g. cosine similarity) from the reference vector. This can be done in [Circom](https://docs.circom.io/) under suitable assumptions. 