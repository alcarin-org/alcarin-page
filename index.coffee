"use strict"

express     = require 'express'
compression = require 'compression'

app = express()
oneDay = 86400000

app.use(compression())
app.use(express.static(__dirname + '/public', { maxAge: oneDay }))

app.listen(3000)
