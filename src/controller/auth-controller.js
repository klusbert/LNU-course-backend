import jwt from 'jsonwebtoken'
import LNUAuthenticator from '../model/LNUAuthenticator.js'
const tokenSecret = process.env.TOKEN_SECRET

/**
 * Big thanks to https://www.section.io/engineering-education/node-authentication-api/
 */
export class AuthController {
  /**
   * Get index.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {object} - status code.
   */
  async login (req, res) {
    const userName = req.body.userName
    const password = req.body.password
    if (userName || password) {
      const lnuAuth = new LNUAuthenticator(userName, password)

      const authenticated = await lnuAuth.authenticate()
      if (authenticated) {
        return res.status(200).json({ token: this.generateToken(userName), userName: userName })
      }
    }

    return res.status(403).json({ error: 'Auth failed.' }) // access denied!
  }

  /**
   * A function that cannot be called if not authenticated.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {object} - status code.
   */
  async mySecretFunction (req, res) {
    return res.status(200).json({ allowed: req.userName })
  }

  /**
   * Generates a token on successfully login!.
   *
   * @param {string} userName - Identifier.
   * @returns {string} - SessionToken.
   */
  generateToken (userName) {
    return jwt.sign({ data: userName }, tokenSecret, { expiresIn: '24h' })
  }

  /**
   * Middleware that checks if a request is authorized.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Next express middleware.
   *
   * @returns {object} - status code.
   */
  verifyToken (req, res, next) {
    const token = req.body.token

    if (token) {
      try {
        const decoded = jwt.verify(token, tokenSecret)

        if (decoded) {
          if (req.body.userName === decoded.data) {
            req.userName = decoded.data
            next()
            return
          }
        }
      } catch (e) {
        return res.status(403).json({ error: 'please provide a valid token' })
      }
    }
    return res.status(403).json({ error: 'please provide a valid token' })
  }
}
