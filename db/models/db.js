const Sequelize = require('sequelize');
console.log(process.env.databaseOptions);
const db = new Sequelize(process.env.databaseURL, JSON.parse(process.env.databaseOptions));

db
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.log('Unable to connect to the database:', err));

module.exports = db;
