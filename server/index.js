// Express App Setup
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { pgClient, redisClient } from './database/index.js'

const PORT = process.env.PORT || 5001
const app = express()
app.use(cors())
app.use(bodyParser.json())

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
  pgClient.query('INSERT INTO values(number, fib_value) VALUES($1, $2)', [
    index,
    0,
  ])

  res.send({ working: true })
})

app.listen(PORT, (err) => {
  console.log(`Listening on port ${PORT}`)
})
