// src/repositories/crud-repository.js
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return this.model.create({ data });
    }

    async get(id, field = "recordId") {
        const record = await this.model.findUnique({
            where: { [field]: id },
        });
        if (!record) {
            throw new AppError("Resource not found", StatusCodes.NOT_FOUND);
        }
        return record;
    }

    async getAll() {
        return this.model.findMany();
    }

    async update(id, data, field = "recordId") {
        const record = await this.model.update({
            where: { [field]: id },
            data,
        });
        return record;
    }

    async destroy(id, field = "recordId") {
        const record = await this.model.delete({
            where: { [field]: id },
        });
        if (!record) {
            throw new AppError("Resource not found", StatusCodes.NOT_FOUND);
        }
        return record;
    }
}

module.exports = CrudRepository;
