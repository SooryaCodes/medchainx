const { generateUniqueId } = require("../blockchain/utils");
const fs = require("fs");
const Patient = require("../models/Patient");
const Block = require("../blockchain/Block");

class PatientController {
  static addPatient(req, res) {
    try {
      const { name, age, diagnosis, description, fileName, fileContent } = req.body;
      const patientId = generateUniqueId("patient");
      const timestamp = new Date().toISOString();

      const fileData = {
        fileName,
        fileContent,
      };

      const patientRecord = new Patient(patientId, name, age, diagnosis, description, timestamp, fileData);

      // Add patient record to the blockchain
      const blockchain = req.blockchain;
      const newBlock = new Block(blockchain.chain.length, timestamp, patientRecord, blockchain.getLatestBlock().hash);
      blockchain.addBlock(newBlock);

      // Save patient record to data.json
      const data = JSON.parse(fs.readFileSync("src/data.json"));
      data.patients.push(patientRecord);
      fs.writeFileSync("src/data.json", JSON.stringify(data, null, 2));

      res.status(201).json({ message: "Patient record added", patientRecord });
    } catch (error) {
      console.error("Error adding patient record:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static getPatient(req, res) {
    try {
      const patientId = req.params.id;
      const data = JSON.parse(fs.readFileSync("src/data.json"));
      const patientRecord = data.patients.find((p) => p.id === patientId);

      if (patientRecord) {
        res.status(200).json({ message: "Patient record retrieved", patientRecord });
      } else {
        res.status(404).json({ message: "Patient not found" });
      }
    } catch (error) {
      console.error("Error retrieving patient record:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static getBlockchain(req, res) {
    try {
      res.status(200).json(req.blockchain.chain);
    } catch (error) {
      console.error("Error retrieving blockchain:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = PatientController;