require('dotenv').config()
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const chalk = require('chalk')
const cliBoxes = require('cli-boxes')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 2006
const { join } = require('path')
app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl
    if (pathname === '/sw.js' || /^\/(workbox|worker|fallback)-\w+\.js$/.test(pathname)) {
      const filePath = join(__dirname, 'public', pathname)
      app.serveStatic(req, res, filePath)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(port, (err) => {
    if (err) throw err
    /**
     * Initialize borders
     */

    const topLeft = `${chalk.blueBright(cliBoxes.double.topLeft)}`
    const topRight = `${chalk.blueBright(cliBoxes.double.topRight)}`
    const line = `${chalk.blueBright(cliBoxes.double.top).repeat(process.stdout.columns - 2)}`
    const topBorder = `${topLeft}${line}${topRight}`
    const bottomBorder = `${chalk.blueBright(cliBoxes.double.bottomLeft)}${line}${chalk.blueBright(
      cliBoxes.double.bottomRight
    )}`

    /**
     * Output
     */

    console.log(`
${topBorder}

${chalk.bgRedBright('REALM1000 TELCO PROJECT')}


${`${chalk.greenBright('Ready on PORT: ')}${chalk.yellow(port)}`}


${chalk.greenBright('BACKEND_HOSTNAME: ') + chalk.yellow(process.env.BACKEND_HOSTNAME)}
${chalk.greenBright('NODE_ENV: ') + chalk.yellow(process.env.NODE_ENV)}


${bottomBorder}
`)
  })
})
