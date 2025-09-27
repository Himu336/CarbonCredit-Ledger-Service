const CrudRepository = require('./crud-repository');
const prisma = require('../config/db-config');

class EventRepository extends CrudRepository {
    constructor() {
        super(prisma.event); // Prisma model
    }

    //Add here any specific methods
    async findByRecordAndType(recordId, type) {
        return await prisma.event.findMany({
            where: {
                recordId,
                type
            }
        });
    }
}

module.exports = EventRepository;