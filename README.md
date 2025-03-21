# Project Setup Guide

This document explains how to set up and run this Truffle/Node.js project locally.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Clone or Download the Project](#clone-or-download-the-project)
- [Install Dependencies](#install-dependencies)
- [Configure Environment Variables](#configure-environment-variables)
- [Compile and Deploy Smart Contracts](#compile-and-deploy-smart-contracts)
- [Run the Application (If Applicable)](#run-the-application-if-applicable)
- [Test the Project](#test-the-project)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Ganache or Other Local Blockchain
If you want to deploy and test your contracts locally, install [Ganache](https://trufflesuite.com/ganache/) or use another local Ethereum test environment.

---

## Clone or Download the Project

If the project is on GitHub, clone it with:
```bash
git clone <REPO_URL>
```
If you have a ZIP file, unzip it into a folder on your system.

Then, open the project folder in your terminal or [VS Code](https://code.visualstudio.com/).

---

## Install Dependencies

Inside the project folder, run:
```bash
npm install
```
This will install all Node.js dependencies listed in `package.json`.

---

## Configure Environment Variables

There is a `.env` file in the project. Make sure you fill in any necessary variables (for example, API keys, database credentials, private keys for test accounts, etc.). If there’s a sample `.env.example`, rename it to `.env` and update the values accordingly.

Common environment variables might include:
- `MNEMONIC` or `PRIVATE_KEY` for deploying contracts
- `INFURA_KEY` or other provider URLs
- `DB_CONNECTION` strings if you have a `database.js` that needs them

---

## Compile and Deploy Smart Contracts

### Compile
```bash
npx truffle compile
```
This will compile your Solidity contracts and place the artifacts in the `build` folder.

### Migrate (Deploy)
Make sure Ganache (or another local blockchain) is running if you’re deploying locally. Then run:
```bash
npx truffle migrate
```
This deploys your contracts to the configured network in `truffle-config.js`.

> **Note:** If you want to deploy to a testnet (e.g., Rinkeby, Goerli, etc.), you’ll need the appropriate network configuration in `truffle-config.js` and the correct environment variables (like an Infura project ID and your wallet private key).

---

## Run the Application (If Applicable)

If this project includes a frontend (e.g., React, Vue) under the `src` folder, there is often a script to start a development server. Common commands might be:
```bash
npm run dev
```
or
```bash
npm start
```

If it’s purely a Node.js backend with routes in the `routes` folder, you might see a script like:
```bash
node index.js
```
or
```bash
npm run server
```
Check the `package.json` file for the exact script names.

---

## Test the Project

If there’s a `test` folder (as indicated in the directory structure), you can run:
```bash
npx truffle test
```
This will execute your smart contract tests. If there are additional backend/frontend tests, you may see something like:
```bash
npm test
```
Check the `package.json` scripts or the documentation for details.

---

## Troubleshooting

### Missing .env Variables
- Make sure your `.env` is populated correctly. Sometimes a `.env.example` file is included with sample keys.

### Network Configuration
- Double-check your `truffle-config.js` to ensure you’re pointing to the correct network (local vs testnet vs mainnet).

### Dependencies
- If you run into errors about missing modules, try removing `node_modules` and reinstalling:
  ```bash
  rm -rf node_modules
  npm install
  ```

### Ganache Issues
- If you can’t connect to Ganache, verify Ganache is running and the port/network ID matches your `truffle-config.js`.
