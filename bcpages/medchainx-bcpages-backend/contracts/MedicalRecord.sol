pragma solidity ^0.8.0;

contract MedicalRecord {
    struct Record {
        string patientName;
        string hospitalName;
        uint256 dateOfEstablishment;
        string recordDescription;
        uint256 versionNumber;
        address doctorAddress;
    }

    mapping(bytes32 => Record) private records;
    mapping(bytes32 => bool) private recordExists;

    event RecordAdded(bytes32 indexed recordHash, string patientName, address doctorAddress);
    
    modifier onlyDoctor(address _doctorAddress) {
        require(_doctorAddress != address(0), "Invalid doctor address");
        _;
    }

    function addRecord(
        bytes32 _recordHash,
        string memory _patientName,
        string memory _hospitalName,
        uint256 _dateOfEstablishment,
        string memory _recordDescription,
        uint256 _versionNumber,
        address _doctorAddress
    ) public onlyDoctor(_doctorAddress) {
        require(!recordExists[_recordHash], "Record already exists");
        
        records[_recordHash] = Record({
            patientName: _patientName,
            hospitalName: _hospitalName,
            dateOfEstablishment: _dateOfEstablishment,
            recordDescription: _recordDescription,
            versionNumber: _versionNumber,
            doctorAddress: _doctorAddress
        });
        
        recordExists[_recordHash] = true;
        
        emit RecordAdded(_recordHash, _patientName, _doctorAddress);
    }

    function getRecord(bytes32 _recordHash) public view returns (Record memory) {
        require(recordExists[_recordHash], "Record does not exist");
        return records[_recordHash];
    }
}