const { generateUniqueId } = require("../blockchain/utils");
const fs = require("fs");
const Patient = require("../models/Patient");
const Block = require("../blockchain/Block");

const sections = ["medicalHistory", "labResults", "prescriptions", "doctorNotes", "files"];

class PatientController {
    static async updatePatient(req, res) {
        const { token, patientId, doctorId, section, data } = req.body;
        if (!sections.includes(section)) return res.status(400).json({ message: "Invalid section" });

        let updateData = data;

        if (section === "files" && req.file) {
            updateData = { fileName: req.file.originalname, fileUrl: `/uploads/${req.file.filename}` };
        }

        const blockchainData = {
            patientId,
            updatedBy: doctorId,
            section,
            newData: updateData,
            timestamp: new Date().toISOString(),
        };

        const transactionHash = await sendToBlockchain(blockchainData);

        res.json({
            message: "Patient record updated",
            section,
            updatedData: updateData,
            transactionHash,
        });
    }

    static addPatient(req, res) {
        const { name, age, diagnosis, description, fileName, fileContent } = req.body;
        const patientId = generateUniqueId("patient");
        const timestamp = new Date().toISOString();

        const fileData = {
            fileName,
            fileContent,
        };

        const patientRecord = new Patient(patientId, name, age, diagnosis, description, timestamp, fileData);

        // Save patient record to data.json
        const data = JSON.parse(fs.readFileSync("src/data.json"));
        data.patients.push(patientRecord);
        fs.writeFileSync("src/data.json", JSON.stringify(data, null, 2));

        res.status(201).json({ message: "Patient record added", patientRecord });
    }

    static getPatient(req, res) {
        const patientId = req.params.id;
        const data = JSON.parse(fs.readFileSync("src/data.json"));
        const patientRecord = data.patients.find((p) => p.id === patientId);

        if (patientRecord) {
            res.status(200).json({ message: "Patient record retrieved", patientRecord });
        } else {
            res.status(404).json({ message: "Patient not found" });
        }
    }

    static getBlockchain(req, res) {
        res.status(200).json(req.blockchain.chain);
    }
}

module.exports = PatientController;
