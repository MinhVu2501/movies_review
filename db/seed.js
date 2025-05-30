const client = require('./client.js');

const dropTables = async() => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS movies;
      DROP TABLE IF EXISTS users;
      `);
  } catch(err) {
    console.log(err);
  }
}

const createTables = async() => {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
        );

      CREATE TABLE movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100),
        year INT,
        poster_url TEXT,
        summary TEXT
        );

      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        movie_id INT REFERENCES movies(id),
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

      `);
  } catch(err) {
    console.log(err);
  }
}

const syncAndSeed = async() => {
  await client.connect();
  console.log(`CONNECTED TO DB`);

  console.log(`DROPPING TABLES`);
  await dropTables();
  console.log(`TABLES DROPPED`);

  console.log(`ADDING TABLES`);
  await createTables();
  console.log(`TABLES ADDED`);

  await client.end();
  console.log(`DISCONNECTED TO DB`);
}

syncAndSeed();