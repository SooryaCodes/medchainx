const express = require('express');
const patientController = require('../controllers/patientController');

const router = express.Router();

router.post('/add-patient', patientController.addPatient);
router.get('/get-patient/:id', patientController.getPatient);
router.get("/data",(req,res)=>{
    res.send("Hello World") 
})
module.exports = router;