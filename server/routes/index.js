import express from 'express'
import { pgClient, redisClient } from '../database/index.js'

export const router = express.Router()

router.get('/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values')

  res.send(values.rows)
})

router.get('/current', async (req, res) => {
  const values = await redisClient.hGetAll('values')
  res.send(values)
})

router.post('/', async (req, res) => {
  const index = req.body.index
  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high')
  }

  redisClient.hSet('values', index, 'Nothing yet!')
  redisClient.publish('insert', index)

  res.send({ working: true })
})
