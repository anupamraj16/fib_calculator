import {
  redisHost,
  redisPort,
  pgUser,
  pgHost,
  pgDatabase,
  pgPassword,
  pgPort,
} from './keys.js'

// Express App Setup
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const PORT = process.env.PORT || 5001
const app = express()
app.use(cors())
app.use(bodyParser.json())

// Postgres Client Setup
import Client from 'pg'
const pgClient = new Client.Client({
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

// Redis Client Setup
import { createClient } from 'redis'
const redisClient = createClient({
  url: `${redisHost}://${redisHost}:${redisPort}`,
  retry_strategy: () => 1000,
})
redisClient.on('error', (err) => console.log('Redis Client Error', err))
await redisClient.connect()
const subscriber = redisClient.duplicate()
subscriber.on('error', (err) => console.error(err))
await subscriber.connect()

// Express route handlers
app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values')

  res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
  const values = await redisClient.hGetAll('values')
  res.send(values)
})

app.post('/values', async (req, res) => {
  const index = req.body.index
  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high')
  }

  redisClient.hSet('values', index, 'Nothing yet!')
  redisClient.publish('insert', index)
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

  res.send({ working: true })
})

app.listen(PORT, (err) => {
  console.log(`Listening on port ${PORT}`)
})
