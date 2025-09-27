const RecordRepository = require('../repositories/record-repository');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

const { createEvent } = require('./event-service');
const { GenerateRecordId } = require('../utils/common');
const EventRepository = require('../repositories/event-repository');

const recordRepository = new RecordRepository();
const eventRepository = new EventRepository();

async function createRecord(data) {
    try {
        //use the utils function to generate a unique id
        const recordId = GenerateRecordId(data);

        // validate data
        if(data.quantity <=0 ) throw new AppError('Quantity must be greater than 0', StatusCodes.BAD_REQUEST);
        if(data.vintage < 1900 || data.vintage > new Date().getFullYear()) throw new AppError('Vintage year is not valid', StatusCodes.BAD_REQUEST);

        // check if already exists
        const existingRecord = await recordRepository.get(recordId);
        if (existingRecord) {
            throw new AppError(`Record with recordId ${recordId} already exists`, StatusCodes.CONFLICT);
        }

        //create a new record
        const newRecord = await recordRepository.create({
            recordId,
            projectName: data.projectName,
            registry: data.registry,
            vintage: data.vintage,
            quantity: data.quantity,
            serialNumber: data.serialNumber,
        });

        // Automatically generate a CREATED event for this record
        await createEvent({
            recordId: newRecord.recordId,
            type: 'CREATED',
            description: 'Record created in the system',
            quantity: newRecord.quantity
        });

        return newRecord;

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        // For unknown errors, wrapping with more context
        console.error('Error in createRecord service:', {
            message: error.message,
            stack: error.stack,
            inputData: data
        });
        
        //general error message
        throw new AppError('Cannot create a new record object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

async function retireRecord(recordId, retireQuantity) {
    try {
        // fetch the record 
        const record = await recordRepository.get(recordId);
        if (!record) throw new AppError(`Record with recordId ${recordId} not found`, StatusCodes.NOT_FOUND);

        // calculate already retired credits
        const retiredEvents = await eventRepository.findByRecordAndType(recordId, 'RETIRED');
        const totalRetired = retiredEvents.reduce((sum, event) => sum + (event.quantity || 0), 0);

        const availableBalance = record.quantity - totalRetired;

        //validate retire quantity
        if (retireQuantity <= 0) throw new AppError('Retire quantity must be greater than 0', StatusCodes.BAD_REQUEST);
        if (retireQuantity > availableBalance) throw new AppError('Insufficient balance to retire the requested quantity', StatusCodes.BAD_REQUEST);
        
        // create a RETIRED event
        const retireEvent = await createEvent({
            recordId: record.recordId,
            type: 'RETIRED',
            description: `Retired ${retireQuantity} credits`,
            quantity: retireQuantity
        });

        return retireEvent;

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        // Log unknown errors with context
        console.error('Error in retireRecord service:', {
            message: error.message,
            stack: error.stack,
            recordId,
            retireQuantity
        });

        throw new AppError('Cannot retire credits from the record', StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

async function getRecordById(recordId) {
    try {
        const record = await recordRepository.getRecordWithEvents(recordId);
        if(!record) {
            throw new AppError(`Record with recordId ${recordId} not found`, StatusCodes.NOT_FOUND);
        }
        return record;
    } catch (error) {
        if(error instanceof AppError) {
            throw error;
        }

        console.error('Error in getRecordById service:', {
            message: error.message,
            stack: error.stack,
            recordId,
        });
        throw new AppError('Cannot fetch the record', StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    createRecord,
    retireRecord,
    getRecordById
}