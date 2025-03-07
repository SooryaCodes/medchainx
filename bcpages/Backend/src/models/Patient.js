class Patient {
    constructor(id, name, age, diagnosis, description, timestamp, file) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.diagnosis = diagnosis;
        this.description = description;
        this.timestamp = timestamp;
        this.file = file;
    }
}

module.exports = Patient;