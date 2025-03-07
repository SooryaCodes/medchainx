// filepath: contracts/MedicalRecord.sol
pragma solidity ^0.8.0;

contract MedicalRecord {
    struct Record {
        string patientName;
        string hospitalName;
        string dateOfEstablishment;
        string recordDescription;
        uint256 versionNumber;
    }

    mapping(bytes32 => Record) public records;

    function addRecord(bytes32 hash, string memory patientName, string memory hospitalName, string memory dateOfEstablishment, string memory recordDescription, uint256 versionNumber) public {
        records[hash] = Record(patientName, hospitalName, dateOfEstablishment, recordDescription, versionNumber);
    }

    function getRecord(bytes32 hash) public view returns (Record memory) {
        return records[hash];
    }
}