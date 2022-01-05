import { Sequelize } from 'sequelize';
import config, { env } from '.'

const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig);

export default sequelize;