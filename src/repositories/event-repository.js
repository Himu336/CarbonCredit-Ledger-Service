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

    //Add transaction specific methods
    async findRetiredCreditsInTx(recordId, tx) {
        return await tx.event.findMany({
            where: {
                recordId,
                type: 'RETIRED'
            }
        });
    }

    async createRetirementEventInTx(eventData, tx) {
        return await tx.event.create({
            data: {
                eventId: eventData.eventId,
                recordId: eventData.recordId,
                type: 'RETIRED',
                description: eventData.description,
                quantity: eventData.quantity,
                createdAt: new Date()
            }
        });
    }
}

module.exports = EventRepository;