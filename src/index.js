const { serverConfig, logger } = require("./config");
const prisma = require("./config/db-config");
const express = require("express");
const apiRoutes = require("./routes");
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(serverConfig.PORT, async () => {
    try {
        await prisma.$connect();
        logger.info("Successfully connected to the database");
        logger.info(`Server started on PORT ${serverConfig.PORT}`);
        console.log(`Server started on PORT ${serverConfig.PORT}`);
    } catch (error) {
        logger.error(error);
    }
});