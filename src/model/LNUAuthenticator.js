import { fetch, CookieJar } from 'node-fetch-cookies'

/**
 *
 */
export default class LNUAuthenticator {
  /**
   * Init the LNUAuthenticator.
   *
   * @param {string} userName - Target userName.
   * @param {string} password - Target password.
   */
  constructor (userName, password) {
    this._userName = userName
    this._password = password
  }

  /**
   * Authenticate a users.
   *
   *@returns {boolean} Whether the user is authenticated
   */
  async authenticate () {
    try {
      const cookieJar = new CookieJar()
      await fetch(cookieJar, 'https://mymoodle.lnu.se/login/index.php')

      const authResult = await this.idpAuthenticate(cookieJar)

      if (!authResult) {
        throw new Error('No shib cookie found')
      }
      console.log('Login successful')
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Post to idpAuthenticate.
   *
   * @param {object} cookieJar CokieJar object.
   * @param {number}timeout - Cancel the post of this time.
   * @returns {boolean} - True on success, false on failure.
   */
  async idpAuthenticate (cookieJar, timeout = 3000) {
    const url = 'https://idp.lnu.se/idp/profile/SAML2/Redirect/SSO?execution=e1s1'
    // generate search params
    const params = new URLSearchParams()
    params.append('j_username', this._userName)
    params.append('j_password', this._password)
    params.append('_eventId_proceed', 'Login')

    await this.timeout(
      2000,
      fetch(cookieJar, url, {
        method: 'POST',
        body: params
      })
    )

    // check if shib idp cookie is present in the cookie list
    for (const cookie of cookieJar.cookiesAll()) {
      if (cookie.name === 'shib_idp_session_ss') return true
    }
    return false
  }

  /**
   * Times out of a set period of time.
   *
   * @param ms
   * @param promise
   * @returns {Promise} -as
   */
  timeout (ms, promise) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('TIMEOUT'))
      }, ms)

      promise
        .then(value => {
          clearTimeout(timer)
          resolve(value)
        })
        .catch(reason => {
          clearTimeout(timer)
          reject(reason)
        })
    })
  }
}
