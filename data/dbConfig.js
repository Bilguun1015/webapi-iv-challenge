const knex = require('knex');

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('../knexfile.js'[development]);

module.exports = knex(knexConfig.development);
