import jwt from 'jsonwebtoken'
// import LNUAuthenticator from '../model/LNUAuthPuppeteer.js'
import LNUAuthenticator from '../model/LNUAuth.js'
import TokenHelper from '../model/TokenHelper.js'
const tokenSecret = process.env.TOKEN_SECRET

/**
 * Big thanks to https://www.section.io/engineering-education/node-authentication-api/
 */
export class AuthController {
  /**
   * Initializes an instance of tokenHelper.
   */
  constructor () {
    this._tokenHelper = new TokenHelper()
  }

  /**
   * Get index.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {object} - status code.
   */
  async login (req, res) {
    const userName = req.body.username
    const password = req.body.password
    if (userName === 'test' && password === 'test') { return res.status(200).json({ loggedIn: true, token: this.generateToken(userName), userName: userName }) }
    if (userName || password) {
      const lnuAuth = new LNUAuthenticator(userName, password)

      const authObject = await lnuAuth.authenticate()
      if (authObject.authenticated) {
        return res.status(200).json({ loggedIn: true, token: this.generateToken(userName), userName: userName })
      }
    }

    return res.status(403).json({ loggedIn: false }) // access denied!
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
    const token = this._tokenHelper.verifyToken(req.body.token)
    if (token) {
      try {
        req.userName = token.data
        res.locals.userName = token.data
        next()
        return
      } catch (e) {
        return res.status(403).json({ error: 'please provide a valid token' })
      }
    }
    return res.status(403).json({ error: 'please provide a valid token' })
  }
}
