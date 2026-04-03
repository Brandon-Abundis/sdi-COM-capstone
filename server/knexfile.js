// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_URL ? 'db' : '127.0.0.1',
      // host: 'localhost',
      // host: 'db',
      port: 5432,
      user: 'postgres',
      password: 'docker',
      database: 'com_db'
    }
  }

};
