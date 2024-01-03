import { pgClient, redisClient, subscriber } from './database/index.js'

function fib(index) {
  if (index < 2) return 1
  return fib(index - 1) + fib(index - 2)
}

const listener = (message, channel) => {
  const fibValue = fib(parseInt(message))
  redisClient.hSet('values', message, fibValue)
}

await subscriber.subscribe('insert', listener)
