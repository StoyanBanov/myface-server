const { static, json } = require('express')
const cors = require('cors')
const { auth } = require('../middleware/auth')
const { searchParams } = require('../middleware/searchParams')
const formParser = require('../middleware/formParser')
const trimmer = require('../middleware/trimmer')

const corsOptions = {
    origin: function (origin, callback) {
        if (origin === process.env.CLIENT_ADDRESS) {
            callback(null, true)
        } else {
            //console.log(origin);
            callback(new Error(origin + ' not allowed by CORS'))
        }
    }
}

module.exports = (app) => {
    app.use(cors(corsOptions))

    app.use('/static', static('static'))

    app.use(formParser())
    app.use(json())
    app.use(trimmer())

    app.use(searchParams())

    app.use(auth())
}