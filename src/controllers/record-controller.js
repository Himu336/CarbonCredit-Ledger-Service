const { RecordService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");

async function createRecord(req, res) {
    try {
        const record = await RecordService.createRecord({
            projectName: req.body.projectName,
            registry: req.body.registry,
            vintage: req.body.vintage,
            quantity: req.body.quantity,
            serialNumber: req.body.serialNumber
        });
        SuccessResponse.data = record;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode)
            .json(ErrorResponse);
    }
};

async function retireRecord(req, res) {
    try {
        const recordId  = req.params.id;
        const retireQuantity = req.body.quantity;
        const updatedRecord = await RecordService.retireRecord(recordId, retireQuantity);
        SuccessResponse.data = updatedRecord;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(error.statusCode)
            .json(ErrorResponse);
    }
};


module.exports = {
    createRecord,
    retireRecord
}