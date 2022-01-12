require('dotenv').config();

import Joi, { Schema } from 'joi';
import mariaDb from 'mariadb';
import { Dialect } from 'sequelize';

const loadConfig = (schema: Schema) => {

  const { value: envVars, error } = schema.prefs({ errors: { label: 'key' } }).validate(process.env);

  if (error) {
    console.error(`Config validation error: ${error.message}`);
    process.exit(1);
  }

  return envVars;
};

const stages = ['production', 'development', 'test'];
const sequelizeMetadataStorage = ['none', 'sequelize', 'json'];

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid(...stages).default('development'),
    DB_HOST: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DRIVER: Joi.string().default('mariadb'),
    DB_CONNECTION_LIMIT: Joi.number().default(5),
    DB_SEED_STORAGE: Joi.string().valid(...sequelizeMetadataStorage).default('sequelize')
  })
  .unknown();

const envVars = loadConfig(envVarsSchema);



const config = {
  nodeEnv: envVars.NODE_ENV as string,
  isTestEnv: envVars.NODE_ENV !== 'test',
  mariaDb: {
    host: envVars.DB_HOST as string,
    name: envVars.DB_NAME as string,
    user: envVars.DB_USER as string,
    password: envVars.DB_PASSWORD as string,
    driver: envVars.DB_DRIVER as string,
    connectionLimit: envVars.DB_CONNECTION_LIMIT as number,
    seederStorage: envVars.DB_SEED_STORAGE as string,
  }
};

const { nodeEnv, mariaDb: { host, name, user, password, driver, connectionLimit, seederStorage } } = config

export const env = nodeEnv;

export default {
  [nodeEnv || "development"]: {
    host: host,
    database: name,
    username: user,
    password: password,
    dialect: driver as Dialect,
    dialectModule: mariaDb,
    seederStorage,
    pool: {
      max: connectionLimit, // Maximum number of connection in pool
      min: 0, // Minimum number of connection in pool
      acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000 // The maximum time, in milliseconds, that a connection can be idle before being released
    }
  }
};