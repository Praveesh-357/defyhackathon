# PramaanQR – Blockchain-Based Credential Verification

CONTRACT_ADDRESS= 0xc2cD7a2860147a168E4f03bB23f2BBcaA4D6353D

PramaanQR is a secure credential issuance and verification platform designed to eliminate certificate fraud and manual verification delays. It enables institutions such as colleges, training institutes, and companies to issue tamper-proof certificates embedded with QR codes, which can be instantly verified by anyone.

This project was built for the DEFY Hackathon and uses the Shardeum EVM blockchain as the decentralized trust layer.

---

## Problem

Traditional certificate verification is:
- Slow and manual (phone calls, emails, document checks)
- Prone to forgery and fake credentials
- Costly for employers and institutions
- Difficult to scale at a national or global level

---

## Solution

PramaanQR provides:
- Instant QR-based verification
- Tamper-proof certificates backed by blockchain
- No storage of personal data on-chain
- Simple web-based issuing and verification flow

---

## How the System Works (End-to-End)

### 1. Certificate Issuance
1. An institution enters certificate details (name, course, college, year) in the Issuer Dashboard.
2. The backend generates a unique `credentialId`.
3. The full certificate data is hashed using a cryptographic hash function.
4. This hash is stored on the blockchain using a smart contract.
5. A QR code containing only the `credentialId` is generated and embedded in the certificate.

### 2. Certificate Verification
1. A verifier scans the QR code or enters the `credentialId`.
2. The backend fetches the certificate data using the `credentialId`.
3. The backend recomputes the hash.
4. The blockchain smart contract is queried to check if the hash exists.
5. If the hash matches, the certificate is verified as authentic.

---

## Role of the Smart Contract (IMPORTANT)

### Why a Smart Contract is Used
The smart contract acts as a **public, immutable source of truth** that proves a certificate existed and has not been altered.

- It prevents modification or deletion of issued credentials
- It removes the need to trust a single centralized database
- It enables anyone to verify authenticity without contacting the issuer

---

### Where the Contract Address Is Used

CONTRACT_ADDRESS= 0xc2cD7a2860147a168E4f03bB23f2BBcaA4D6353D

The **smart contract address** is used **inside the backend**, not in the frontend.

- The backend connects to the deployed smart contract using:
  - Blockchain RPC URL
  - Contract address
  - Backend wallet private key
- When issuing a certificate, the backend calls the contract function:
  `issueCredential(hash)`
- When verifying a certificate, the backend calls:
  `verifyCredential(hash)`

The frontend never directly interacts with the blockchain.

---

### Why the Contract Address Is Fixed

- The smart contract is deployed **once** on the Shardeum EVM Testnet.
- The deployed address uniquely identifies the contract on the blockchain.
- All certificate issuance and verification operations reference this same address.
- This ensures consistency, trust, and auditability.

---

## Blockchain Usage (Shardeum Sponsor)

- Network: Shardeum EVM Testnet
- Smart Contract: Solidity-based credential registry
- On-chain data: Only cryptographic hashes
- Off-chain data: Certificate details stored in backend

Shardeum was chosen because:
- It is EVM-compatible
- It offers low transaction costs
- It is scalable for high-volume credential issuance
- It is suitable for public-good infrastructure

---

## Project Structure

defyhackathon/
├── certificate-issuance-hub-main/ # Frontend (React + Vite)
├── pramaanqr-backend/ # Backend (Node.js + Express)
├── pramaanqr-blockchain/ # Smart Contract (Solidity + Hardhat)
└── README.md
