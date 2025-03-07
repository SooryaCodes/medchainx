# MedChain X Backend

MedChain X is a backend application designed to manage medical records securely using blockchain technology. This project implements a patient and doctor authentication system, medical record management, and interactions with both public and private blockchains.

## Project Structure

```
medchainx-bcpages-backend
├── src
│   ├── auth                # Authentication logic for patients and doctors
│   ├── blockchain          # Blockchain interactions and smart contract management
│   ├── database            # Database models and connection setup
│   ├── routes              # API endpoints for the application
│   ├── services            # Business logic for processing records and permissions
│   └── main.py             # Entry point of the application
├── contracts               # Solidity smart contracts for managing medical records
│   └── MedicalRecord.sol
├── migrations              # Database migrations
├── tests                   # Unit and integration tests
├── .env                    # Environment variables for configuration
├── Dockerfile              # Docker setup for the application
└── README.md               # Project documentation
```

## Features

- **Patient Authentication**: Register and log in patients securely.
- **Doctor Authentication**: Register and log in doctors with access control.
- **Medical Records Management**: View and manage medical records with temporary hash generation for secure access.
- **Blockchain Integration**: Store cryptographic hashes of medical records on Ethereum and manage private data with Hyperledger Fabric.

## Setup Instructions

1. **Clone the Repository**:
   ```
   git clone https://github.com/medchainx/bcpages.git
   cd medchainx-bcpages-backend
   ```

2. **Install Dependencies**:
   Ensure you have Python and pip installed, then run:
   ```
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and set the necessary environment variables for database connections and API keys.

4. **Run Migrations**:
   Use the migration tool to set up the database schema:
   ```
   python -m migrations
   ```

5. **Start the Application**:
   Run the FastAPI application:
   ```
   uvicorn src.main:app --reload
   ```

## API Usage

Refer to the API documentation for detailed information on available endpoints, request/response formats, and authentication methods.

## Testing

To run the tests, use:
```
pytest tests/
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.