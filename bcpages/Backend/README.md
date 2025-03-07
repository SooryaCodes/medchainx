# Private Blockchain Backend for Patient and Hospital Records

This project implements a simple private blockchain using Node.js and Express.js to store patient and hospital records securely. The blockchain features basic functionality such as blocks, hashing, and proof-of-work, ensuring data integrity and security.

## Features

- **Patient Records**: Store and retrieve patient information including ID, name, age, and diagnosis.
- **Hospital Records**: Store and retrieve hospital information including hospital ID, name, and doctor name.
- **Medical Reports**: Basic functionality to store medical reports as text files.
- **Unique IDs**: Automatically generates unique IDs for patients and hospitals.
- **SHA-256 Hashing**: Ensures data security through hashing.
- **Proof-of-Work**: Implements a basic proof-of-work mechanism for adding new blocks to the blockchain.
- **Time-limited Access Tokens**: Provides access tokens valid for 5 minutes for data access.

## API Endpoints

- `POST /add-patient`: Add a new patient record.
- `POST /add-hospital`: Add a new hospital record.
- `GET /get-blockchain`: Retrieve the full blockchain.
- `GET /get-patient/:id`: Get a specific patient’s record.
- `GET /get-hospital/:id`: Get a specific hospital’s record.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd private-blockchain-backend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   node src/app.js
   ```

4. **Access the API**: Use tools like Postman or curl to interact with the API endpoints.

## Project Structure

```
private-blockchain-backend
├── src
│   ├── blockchain
│   │   ├── Block.js
│   │   ├── Blockchain.js
│   │   └── utils.js
│   ├── controllers
│   │   ├── hospitalController.js
│   │   └── patientController.js
│   ├── models
│   │   ├── Hospital.js
│   │   └── Patient.js
│   ├── routes
│   │   ├── hospitalRoutes.js
│   │   └── patientRoutes.js
│   ├── app.js
│   └── data.json
├── package.json
└── README.md
```

## License

This project is licensed under the MIT License.