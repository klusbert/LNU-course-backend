import fetch from 'node-fetch'

/**
 * Check towards LNU authenticator to see if a user is a student or not.
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
   * Return if a user is athenticated or not.
   *
   *@returns {boolean} Auth status.
   */
  async authenticate () {
    const userName = this._userName
    const pw = this._password
    const s = await fetch('https://coursepress.lnu.se/wp-login.php', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'

      },
      body: `log=${userName}&pwd=${pw}&rememberme=forever&submit=Logga+in`,
      method: 'POST',
      mode: 'cors',
      redirect: 'manual'
    })

    // if a login is successfully it will return a redirect.
    if (s.status === 302) {
      return true
    }

    return false
  }
}
