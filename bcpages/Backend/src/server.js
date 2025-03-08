const express = require('express');
const fs = require('fs');
const path = require('path');
const Blockchain = require('./blockchain');

const app = express();
const port = 3000;

const blockchain = new Blockchain();

const dataFilePath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

data.patients.forEach((patient, index) => {
  const block = new Block(index + 1, patient.timestamp, patient);
  blockchain.addBlock(block);
});

app.get('/blockchain', (req, res) => {
  res.json(blockchain.getChain());
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});