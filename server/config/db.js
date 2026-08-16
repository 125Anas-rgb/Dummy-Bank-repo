require("dotenv").config();

const { PrismaClient } = require("../generated/prisma");

const { PrismaPg } = require("@prisma/adapter-pg");

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

module.exports = prisma;
