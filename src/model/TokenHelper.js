import jwt from 'jsonwebtoken'

/**
 * This class is shared by two or more controllers so we use it shared.
 */
export default class TokenHelper {
  /**
   * Constructor for TokenHelper.
   */
  constructor () {
    this._secret = process.env.TOKEN_SECRET
  }

  /**
   * Generates a token on successfully login!.
   *
   * @param {string} userName - Identifier.
   * @returns {string} - SessionToken.
   */
  generateToken (userName) {
    return jwt.sign({ data: userName }, this._secret, { expiresIn: '24h' })
  }

  /**
   * Verifies a token and returns the token data.
   *
   * @param {string} token - A token to be verified.
   * @returns {object} - Token object.
   */
  verifyToken (token) {
    if (token) {
      try {
        const decoded = jwt.verify(token, this._secret)

        if (decoded) {
          return decoded
        }
      } catch (e) {
        return null
      }
    } else {
      return null
    }
  }
}
