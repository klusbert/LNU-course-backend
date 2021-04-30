import express from 'express'
import morgan from 'morgan'

import cors from 'cors'

import Database from './model/Database.js'
import { router } from './routes/router.js'

const db = new Database(process.env.CONNECTION_STRING, process.env.MONGO_DATABASE_NAME)
const port = process.env.PORT

const app = express()
let mongo = null

/**
 * Start point of the server.
 */
async function main () {
  mongo = await db.getConnection()

  app.use(express.json())

  // enabling CORS for all requests
  app.use(cors())

  // adding morgan to log HTTP requests
  app.use(morgan('combined'))

  // Register routes.
  app.use('/api', router)

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
    console.log('Press Ctrl-C to terminate...')
  })
}

main().then(console.error)
// if application exits we close the connection to mongo.
process.on('SIGINT', () => {
  if (mongo != null)mongo.connection.close()
})
