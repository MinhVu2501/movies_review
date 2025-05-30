const client = require('./client.js');

const createMovie = async ({
  title,
  genre,
  year,
  poster_url,
  summary
} = {}) => {
  if (!title) {
    throw new Error('Title is required');
  }

  try {
    const { rows } = await client.query(
      `INSERT INTO movies (title, genre, year, poster_url, summary)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;`,
      [title, genre || null, year || null, poster_url || null, summary || null]
    );

    return rows[0];
  } catch (err) {
    console.error('Error creating movie:', err);
    throw err;
  }
};

module.exports = {
  createMovie,
};
