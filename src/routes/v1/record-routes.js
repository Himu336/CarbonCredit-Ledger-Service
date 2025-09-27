const express = require('express');

const { RecordController } = require('../../controllers');

const router = express.Router();

// /api/v1/records POST
router.post("/",
    RecordController.createRecord
);

router.post("/:id/retire",
    RecordController.retireRecord
);

router.get("/:id",
    RecordController.getRecordById
);

module.exports = router;