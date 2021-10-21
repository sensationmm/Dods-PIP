import { Sequelize } from 'sequelize';
import config from '.'

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];
export default new Sequelize(dbConfig);