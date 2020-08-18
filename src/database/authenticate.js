// Database connection
const connection = require('./connection');

module.exports = connection.authenticate().then(() => {
    console.log(`Database connection made successfully!\n`);
}).catch(err => {
    console.log(`Error when trying to connect to the Database!\n${err}`);
});
