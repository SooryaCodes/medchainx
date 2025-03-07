const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const patientRoutes = require('./routes/patientRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const Blockchain = require('./blockchain/Blockchain');

const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware

app.use((req, res, next) => {
  req.blockchain = blockchain;
  next();
});

app.use('/api/patient', patientRoutes);
app.use('/api/hospital', hospitalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});