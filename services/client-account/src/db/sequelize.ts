import { Sequelize } from 'sequelize';
import {config} from '../domain';
export default new Sequelize(config.aws.mariaDb.connectionString);