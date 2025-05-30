const client = require('./client.js');
const bcrypt = require('bcrypt');

const createUser = async (username, password) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  try {
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const { rows } = await client.query(
      `INSERT INTO users (username, password)
       VALUES ($1, $2)
       RETURNING *;`,
      [username, hashedPassword]
    );

    return rows[0];
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

module.exports = {
  createUser,
};
