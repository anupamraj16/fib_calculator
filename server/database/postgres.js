import { pgUser, pgHost, pgDatabase, pgPassword, pgPort } from '../keys.js'

// Postgres Client Setup
import Client from 'pg'
export const pgClient = new Client.Client({
  user: pgUser,
  host: pgHost,
  database: pgDatabase,
  password: pgPassword,
  port: pgPort,
  ssl:
    process.env.NODE_ENV !== 'production'
      ? false
      : { rejectUnauthorized: false },
})
pgClient.connect((err) => {
  pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.error(err))
})
