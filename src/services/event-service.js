const EventRepository = require('../repositories/event-repository');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { GenerateEventId } = require('../utils/common');

const eventRepository = new EventRepository();

async function createEvent(data) {
    try {
        // Generate a unique event ID
        const eventId = GenerateEventId(data);

        // Validate required fields
        if (!data.recordId) throw new AppError('recordId is required', StatusCodes.BAD_REQUEST);
        if (!data.type) throw new AppError('eventType is required', StatusCodes.BAD_REQUEST);

        // Create event
        const newEvent = await eventRepository.create({
            eventId,
            recordId: data.recordId,
            type: data.type,
            description: data.description || null
        });

        return newEvent;

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        // Log unknown errors with context
        console.error('Error in createEvent service:', {
            message: error.message,
            stack: error.stack,
            inputData: data
        });

        throw new AppError('Cannot create a new event', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createEvent
};
