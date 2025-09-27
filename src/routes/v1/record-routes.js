const express = require('express');

const { RecordController } = require('../../controllers');
const { RecordMiddlewares } = require('../../middlewares');

const router = express.Router();

// /api/v1/records POST
router.post("/",
    RecordMiddlewares.validateCreateRecord,
    RecordController.createRecord
);

router.post("/:id/retire",
    RecordMiddlewares.validateRetireRecord,
    RecordController.retireRecord
);

router.get("/:id",
    RecordMiddlewares.validateGetRecord,
    RecordController.getRecordById
);

module.exports = router;