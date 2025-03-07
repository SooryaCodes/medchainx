// filepath: contracts/migrations/2_deploy_contracts.js
const MedicalRecord = artifacts.require("MedicalRecord");

module.exports = function (deployer) {
    deployer.deploy(MedicalRecord);
};