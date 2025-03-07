const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

// Route to add a new hospital record
router.post('/add-hospital', hospitalController.addHospital);

// Route to get a specific hospital record by ID
router.get('/get-hospital/:id', hospitalController.getHospital);

module.exports = router;