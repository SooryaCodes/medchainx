const { generateUniqueId } = require('../blockchain/utils');
const Block = require('../blockchain/Block');

class PatientController {
    static addPatient(req, res) {
        const { name, age, diagnosis } = req.body;
        const patientId = generateUniqueId('patient');
        const patientRecord = {
            id: patientId,
            name,
            age,
            diagnosis,
            timestamp: new Date().toISOString()
        };

        const newBlock = {
            patient: patientRecord,
            hospital: null,
            reports: []
        };

        req.blockchain.addBlock(new Block(req.blockchain.chain.length, new Date().toISOString(), newBlock));
        res.status(201).json({ message: 'Patient record added', patientRecord });
    }

    static getPatient(req, res) {
        const patientId = req.params.id;
        const block = req.blockchain.chain.find(block => block.data.patient && block.data.patient.id === patientId);

        if (!block) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json(block.data.patient);
    }

    static getBlockchain(req, res) {
        res.status(200).json(req.blockchain.chain);
    }
}

module.exports = PatientController;