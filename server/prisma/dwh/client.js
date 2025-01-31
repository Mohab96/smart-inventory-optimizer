const { PrismaClient } = require("@prisma/client/dwh/index.js");
const dwhClient = new PrismaClient();

module.exports = dwhClient;
