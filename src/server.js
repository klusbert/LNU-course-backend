import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import session from 'express-session'
import cors from 'cors'

import Database from './model/Database.js'
import { router } from './routes/router.js'

const mongoConnectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PW}@cluster0.zv6lx.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`
const db = new Database(mongoConnectionString, process.env.MONGO_DATABASE_NAME)
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

  // Make the server more secure, by setting various http headers.(helps against XSS attacks,
  app.use(helmet())

  // adding morgan to log HTTP requests
  app.use(morgan('combined'))
<<<<<<< HEAD
=======
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
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust communication between nginx and our application to be secure.
    sessionOptions.cookie.secure = true // ensure that cookies only send over HTTPS(except our trusted proxy)
  }

  app.use(session(sessionOptions))
>>>>>>> ef6b76f3d1e507b8a43b85ef82a673fd23cfb05f

  // Register routes.
  app.use('/api', router)

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
    console.log('Press Ctrl-C to terminate...')
  })
}

main().catch(console.error)
// if application exits we close the connection to mongo.
process.on('SIGINT', () => {
  if (mongo != null)mongo.connection.close()
})
