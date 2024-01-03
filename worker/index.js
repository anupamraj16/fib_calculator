import { pgClient, redisClient, subscriber } from './database/index.js'

function fib(index) {
  if (index < 2) return 1
  return fib(index - 1) + fib(index - 2)
}

const listener = async (message, channel) => {
  const fibValue = fib(parseInt(message))
  redisClient.hSet('values', message, fibValue)
  await pgClient
    .query('INSERT INTO values(number, fib_value) VALUES($1, $2)', [
      message,
      fibValue,
    ])
    .catch((err) => console.error(err))
}

await subscriber.subscribe('insert', listener)
