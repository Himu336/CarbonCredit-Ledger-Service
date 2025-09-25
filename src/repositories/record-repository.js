const CrudRepository = require('./crud-repository');
const prisma = require('../config/db-config');

class RecordRepository extends CrudRepository {
    constructor() {
        super(prisma.record); // Prisma model
    }

    //Add here any specific methods if needed
}

module.exports = RecordRepository;