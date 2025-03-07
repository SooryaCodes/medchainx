const Hospital = require('../models/Hospital');
const Blockchain = require('../blockchain/Blockchain');
const blockchain = new Blockchain();

class HospitalController {
    static addHospital(req, res) {
        const { name, doctorName } = req.body;
        const hospitalId = Hospital.generateUniqueId();
        const newHospital = new Hospital(hospitalId, name, doctorName);
        
        blockchain.addBlock({
            hospitalId: newHospital.hospitalId,
            name: newHospital.name,
            doctorName: newHospital.doctorName,
            timestamp: new Date().toISOString()
        });

        res.status(201).json({ message: 'Hospital added successfully', hospital: newHospital });
    }

    static getHospital(req, res) {
        const hospitalId = req.params.id;
        const hospitalRecord = blockchain.getBlockByHospitalId(hospitalId);

        if (hospitalRecord) {
            res.status(200).json(hospitalRecord);
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    }
}

module.exports = HospitalController;