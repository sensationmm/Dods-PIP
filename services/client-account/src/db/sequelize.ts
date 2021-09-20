import { Sequelize } from 'sequelize';

export default new Sequelize('dods', 'root', 'rootPass', {
    host: 'localhost',
    dialect: 'mariadb'
  });