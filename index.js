const app = require('express')()
const server = http = require('http').createServer(app)

const expressConfig = require('./src/config/express')
const databaseConfig = require('./src/config/database')
const routesConfig = require('./src/config/routes')
const { socketConfig } = require('./src/config/socket')

require('dotenv').config()

socketConfig(server)

const port = process.env.PORT

start(app)

async function start(app) {
    await databaseConfig(app)
    expressConfig(app)
    routesConfig(app)

    server.listen(port, 'localhost', () => console.log('server is running on port ' + port))
}