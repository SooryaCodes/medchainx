const express = require("express");
const patientController = require("../controllers/patientController");

const router = express.Router();

router.post("/add-patient", patientController.addPatient);
router.get("/get-patient/:id", patientController.getPatient);

module.exports = router;
