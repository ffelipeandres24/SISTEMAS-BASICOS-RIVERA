
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('AlquilerA', 'root', 'CTPI2024*', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
