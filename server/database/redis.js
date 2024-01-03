import { redisHost, redisPort } from '../keys.js'
// Redis Client Setup
import { createClient } from 'redis'
export const redisClient = createClient({
  url: `${redisHost}://${redisHost}:${redisPort}`,
  retry_strategy: () => 1000,
})
redisClient.on('error', (err) => console.log('Redis Client Error', err))
await redisClient.connect()
const subscriber = redisClient.duplicate()
subscriber.on('error', (err) => console.error(err))
await subscriber.connect()
