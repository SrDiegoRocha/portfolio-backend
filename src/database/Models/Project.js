const Sequelize = require('sequelize');
const connection = require('../connection');

const Project = connection.define('projects', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    summary: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    source_code: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

Project.sync({force: false});

module.exports = Project;