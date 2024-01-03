import { pgClient, redisClient, subscriber } from './database/index.js'

function fib(index) {
  if (index < 2) return 1
  return fib(index - 1) + fib(index - 2)
}

const listener = async (message, channel) => {
  const fibValue = fib(parseInt(message))
  redisClient.hSet('values', message, fibValue)
  await pgClient.query('UPDATE values SET fib_value = $2 WHERE number = $1', [
    message,
    fibValue,
  ])
}

await subscriber.subscribe('insert', listener)
