const express = require('express');
const router = express.Router();

const { infoController } = require("../../controllers");

const recordRoutes = require('./record-routes');

router.use('/records', recordRoutes);

router.get('/info', infoController.info);

module.exports = router;
