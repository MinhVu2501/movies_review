const client = require('./client.js');

const checkUserExists = async (user_id) => {
  const { rows } = await client.query(
    `SELECT id FROM users WHERE id = $1;`,
    [user_id]
  );
  return rows.length > 0;
};

const checkMovieExists = async (movie_id) => {
  const { rows } = await client.query(
    `SELECT id FROM movies WHERE id = $1;`,
    [movie_id]
  );
  return rows.length > 0;
};

const createReview = async ({ user_id, movie_id, rating, comment }) => {
  if (!user_id) throw new Error('user_id is required');
  if (!movie_id) throw new Error('movie_id is required');
  if (rating === undefined || rating === null) throw new Error('rating is required');
  if (rating < 1 || rating > 5) throw new Error('rating must be between 1 and 5');

  const userExists = await checkUserExists(user_id);
  if (!userExists) throw new Error(`User with id ${user_id} does not exist`);

  const movieExists = await checkMovieExists(movie_id);
  if (!movieExists) throw new Error(`Movie with id ${movie_id} does not exist`);

  try {
    const { rows } = await client.query(
      `
      INSERT INTO reviews (user_id, movie_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [user_id, movie_id, rating, comment || null]
    );
    return rows[0];
  } catch (err) {
    console.error('Error creating review:', err);
    throw err;
  }
};

module.exports = {
  createReview,
};
