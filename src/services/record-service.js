const RecordRepository = require('../repositories/record-repository');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

const { createEvent } = require('./event-service');
const { GenerateRecordId } = require('../utils/common');

const recordRepository = new RecordRepository();

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

module.exports = {
    createRecord
}