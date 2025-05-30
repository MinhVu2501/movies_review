const client = require('./client.js');
const { createUser } = require('./users.js');
const { createMovie } = require('./movies.js');
const { createReview } = require('./reviews.js');
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
        username VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(60) NOT NULL,
        name VARCHAR(30)
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

  console.log(`CREATING TABLES`);
  await createTables();
  console.log(`TABLES CREATED`);
  
  console.log('CREATING USERS');
  await createUser('alice', 'superSecretPassword123');

  console.log('USERS CREATED');
  
  console.log('CREATING MOVIES');
  
  await createMovie({
    title: 'Inception',
    genre: 'Sci-Fi',
    year: 2010,
    poster_url: 'http://example.com/inception.jpg',
    summary: 'A mind-bending thriller...'
    });
    
  console.log('MOVIES CREATED');

  console.log('CREATING REVIEW');

  await createReview({
    user_id: 1,
    movie_id: 1,
    rating: 4,
    comment: 'Really enjoyed this movie!'
  });

  console.log('REVIEWS CREATED');
  await client.end();
  console.log(`DISCONNECTED TO DB`);
}

syncAndSeed();