const Sequelize = require('sequelize');

const connection = new Sequelize('uber', 'root', 'rocha030604', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00',
});

module.exports = connection;