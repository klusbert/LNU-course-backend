import express from 'express'

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

  app.use(express.urlencoded({ extended: false }))

  // Register routes.
  app.use('/api', router)

  app.get('/users', (req, res) => {
    return res.send('GET HTTP method on user resource')
  })

  // Starts the HTTP server listening for connections.
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
