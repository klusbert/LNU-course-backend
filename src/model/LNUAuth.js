import { fetch, CookieJar } from 'node-fetch-cookies'
import AbortController from 'node-abort-controller'

/**
 *
 */
export default class LNUAuth {
  /**
   * Init LNUAuth.
   *
   * @param {string} username - Target username.
   * @param {string} password - password.
   */
  constructor (username, password) {
    this._username = username
    this._password = password
  }

  /**
   * Returns auth object.
   *
   *@returns {object}- Auth object.
   */
  async authenticate () {
    const loginStatus = await this.moodleLogin()

    if (loginStatus) {
      return { authenticated: true }
    }
    return { authenticated: false }
  }

  /**
   * Passes IDP authentication on mymoodle.
   *
   * @returns {boolean} LoginStatus.
   */
  async moodleLogin () {
    try {
      const cookieJar = new CookieJar()
      await fetch(cookieJar, 'https://mymoodle.lnu.se/login/index.php')

      const authResult = await this.idpAuthenticate(cookieJar, 2000)

      if (!authResult) {
        throw new Error('No shib cookie found')
      }

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Idp auth.
   *
   * @param {object} cookieJar - Cookie jar.
   * @param {number} timeout - Time in ms.
   * @returns {boolean} - Login status.
   */
  async idpAuthenticate (cookieJar, timeout = 3000) {
    const url = 'https://idp.lnu.se/idp/profile/SAML2/Redirect/SSO?execution=e1s1'
    // generate search params
    const params = new URLSearchParams()
    params.append('j_username', this._username)
    params.append('j_password', this._password)
    params.append('_eventId_proceed', 'Login')

    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    await fetch(cookieJar, url, {
      method: 'POST',
      body: params,
      signal: controller.signal
    })
    clearTimeout(id)

    // check if shib idp cookie is present in the cookie list
    for (const cookie of cookieJar.cookiesAll()) {
      if (cookie.name === 'shib_idp_session_ss') return true
    }
    return false
  }
}
