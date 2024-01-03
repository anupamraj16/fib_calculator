import { redisHost, redisPort } from './keys.js'
import { createClient } from 'redis'
const redisClient = createClient({
  url: `${redisHost}://${redisHost}:${redisPort}`,
  retry_strategy: () => 1000,
})
redisClient.on('error', (err) => console.log('Redis Client Error', err))
await redisClient.connect()
const subscriber = redisClient.duplicate()
await subscriber.connect()

function fib(index) {
  if (index < 2) return 1
  return fib(index - 1) + fib(index - 2)
}

const listener = (message, channel) => {
  const fibValue = fib(parseInt(message))
  redisClient.hSet('values', message, fibValue)
}

await subscriber.subscribe('insert', listener)
