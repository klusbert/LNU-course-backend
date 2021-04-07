import puppeteer from 'puppeteer'

/**
 *
 */
export default class LNUAuthPupp {
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
   * Returns a object with auth attributes.
   *
   * @returns {Promise<object>} -authObject}
   */
  async authenticate () {
    const browser = await puppeteer.launch({ headless: true })

    const page = await browser.newPage()

    await page.goto('https://mymoodle.lnu.se/login/index.php', { waitUntil: 'networkidle0' })

    await page.type('#username', this._userName)
    await page.type('#password', this._password)

    page.click('#btnSubmit')

    await page.waitForNavigation()

    await page.waitForSelector('body')
    const url = page.url()
    if (url.toString().includes('mymoodle.lnu.se/my/')) {
      await page.waitForSelector('#usermenu')

      const userFullName = await page.evaluate(() => {
        const menu = document.querySelector('#usermenu')
        const span = menu.querySelector('span')
        return span.innerHTML
      })
      const firstName = userFullName.split(' ')[0]
      const lastName = userFullName.split(' ')[1]
      return { authenticated: true, firstName: firstName, lastName: lastName }
    } else {
      return { authenticated: false }
    }
  }
}
