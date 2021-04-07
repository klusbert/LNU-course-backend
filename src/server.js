import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import session from 'express-session'
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
  // Starts the HTTP server listening for connections.
  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false, // Don't resave even if a request is not changing the session.
    saveUninitialized: false, // Don't save a created but not modified session.
    cookie: {
      httpOnly: true, // Prevents cookies to be accessed by the browsers javascript.(XSS)
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'lax' // The default value of cookies, but to explain it does not send the cookie to other sites, only on the origin site.(CSRF)
    }
  }
  app.use(session(sessionOptions))

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
