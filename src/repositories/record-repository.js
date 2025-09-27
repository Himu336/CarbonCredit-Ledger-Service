const CrudRepository = require('./crud-repository');
const prisma = require('../config/db-config');

class RecordRepository extends CrudRepository {
    constructor() {
        super(prisma.record); // Prisma model
    }

    //Add here any specific methods if needed
    async getRecordWithEvents(recordId) {
        const record = await prisma.record.findUnique({
            where: { recordId },
            include: {
                events: true
            }
        });
        return record;
    }
}

module.exports = RecordRepository;