// Express App Setup
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { router } from './routes/index.js'

const PORT = process.env.PORT || 5001
const app = express()
app.use(cors())
app.use(bodyParser.json())

// Express route handlers
app.use('/values', router)

app.listen(PORT, (err) => {
  console.log(`Listening on port ${PORT}`)
})
