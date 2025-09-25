const { PrismaClient } = require("../generated/prisma");
const { NODE_ENV} = require("./server-config");

let prisma;

if (NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // Prevent multiple Prisma clients during hot reload in dev
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
