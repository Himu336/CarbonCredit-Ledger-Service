const express = require('express');

const { RecordController } = require('../../controllers');

const router = express.Router();

// /api/v1/records POST
router.post("/",
    RecordController.createRecord
);

module.exports = router;