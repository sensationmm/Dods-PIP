import { Sequelize } from 'sequelize';
import { config } from '../domain';

const connection = {
    database: config.aws.mariaDb.database,
    username: config.aws.mariaDb.username,
    password: config.aws.mariaDb.password,
};

export default new Sequelize(
    connection.database,
    connection.username,
    connection.password,
    {
        host: config.aws.mariaDb.host,
        dialect: 'mariadb',
    }
);