const express = require("express");
const patientController = require("../controllers/patientController");

const router = express.Router();

router.post("/add-patient", patientController.addPatient);
router.get("/get-patient/:id", patientController.getPatient);
router.get("/get-patient-by-name/:name", patientController.getPatientByName); // New route to get patient by name
router.get("/get-blockchain", patientController.getBlockchain);

module.exports = router;