const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

function validateCreateRecord(req, res, next) {
    const { projectName, registry, vintage, quantity } = req.body;
    if(!projectName) {
        ErrorResponse.message = 'Something went wrong while creating a record';
        ErrorResponse.error = new AppError(
            ['Project name is missing or invalid in the request'],
            StatusCodes.BAD_REQUEST
        );
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);    
    };

    if(!registry) {
        ErrorResponse.message = 'Something went wrong while creating a record';
        ErrorResponse.error = new AppError(
            ['Registry is missing or invalid in the request'],
            StatusCodes.BAD_REQUEST
        );
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);    
    };

    if(!vintage || typeof vintage !== 'number' || vintage <1900 || vintage > new Date().getFullYear()) {
        ErrorResponse.message = 'Something went wrong while creating a record';
        ErrorResponse.error = new AppError(
            ['Vintage year is missing or invalid in the request'],
            StatusCodes.BAD_REQUEST
        );
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);    
    };

    if(!quantity || typeof quantity !== 'number' || quantity <= 0) {
        ErrorResponse.message = 'Something went wrong while creating a record';
        ErrorResponse.error = new AppError(
            ['Quantity is missing or invalid in the request'],
            StatusCodes.BAD_REQUEST
        );
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);    
    };

    next();
}

function validateRetireRecord(req, res, next) {
    const { quantity } = req.body;

    if(!quantity || typeof quantity !== 'number' || quantity <= 0) {
        ErrorResponse.message = 'Something went wrong while retiring a record';
        ErrorResponse.error = new AppError(
            ['Quantity to retire is missing or must be greater than 0'],
            StatusCodes.BAD_REQUEST
        );
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }

    next();
}

function validateGetRecord(req, res, next) {
    const { id } = req.params;

    if(!id || typeof id != 'string') {
        ErrorResponse.message = 'Something went wrong while fetching a record';
        ErrorResponse.error = new AppError(
            ['Record ID is missing or invalid in the request'],
            StatusCodes.BAD_REQUEST
        );
        return res 
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }

    next();
}

module.exports = {
    validateCreateRecord,
    validateRetireRecord,
    validateGetRecord
}