const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/movies_reviews');

module.exports = client; 