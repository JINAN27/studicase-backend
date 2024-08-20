const mongoose = require('mongoose');
const { dbHost, dbPass, dbName, dbPort, dbUser } = require('../app/config');

const dbURI = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(`MongoDB connection error: ${err}`));

const db = mongoose.connection;

module.exports = db;
