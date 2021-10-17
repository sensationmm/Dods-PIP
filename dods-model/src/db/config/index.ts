require('dotenv').config();
import { Dialect } from 'sequelize';

const nodeEnv = process.env.NODE_ENV as string;
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST as string;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD as string;

export default {
  [nodeEnv || "development"]: {
    host: dbHost,
    database: dbName,
    username: dbUser,
    password: dbPassword,
    dialect: dbDriver
  }
};