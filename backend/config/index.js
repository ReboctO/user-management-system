// (Make sure require('dotenv').config(); is called in server.js first!)

module.exports = {
  database: {
    host: "153.92.15.31",
    port: 3306,
    user: "u875409848_elocaylocay",
    password: "9T2Z5$3UKkgSYzE",
    database: "u875409848_elocaylocay",
  },
  secret: "terces",
};

// Then, in other files, use it like:
// const config = require('./config'); // Adjust path as needed
// const sequelize = new Sequelize(config.database.database, ...);
// const jwtSecret = config.secret;
