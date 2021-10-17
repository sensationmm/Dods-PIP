require('dotenv').config();
import { Dialect } from 'sequelize';

const nodeEnv = process.env.NODE_ENV as string;
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST as string;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD as string;
const dbConnectionLimit = parseInt(process.env.DB_CONNECTION_LIMIT!) || 5;

export default {
  [nodeEnv || "development"]: {
    host: dbHost,
    database: dbName,
    username: dbUser,
    password: dbPassword,
    dialect: dbDriver,
    pool: {
      max: dbConnectionLimit, // Maximum number of connection in pool
      min: 0, // Minimum number of connection in pool
      acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000 // The maximum time, in milliseconds, that a connection can be idle before being released
    }
  }
};