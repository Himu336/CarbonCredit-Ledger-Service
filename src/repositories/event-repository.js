const CrudRepository = require('./crud-repository');
const prisma = require('../config/db-config');

class EventRepository extends CrudRepository {
    constructor() {
        super(prisma.event); // Prisma model
    }

    //Add here any specific methods
}

module.exports = EventRepository;