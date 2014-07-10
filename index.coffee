"use strict"

express     = require 'express'
compression = require 'compression'
flags       = require 'flags'
logger      = require 'morgan'
flags.defineBoolean('serve-src-files', false, 'Serve coffeescript and less files on "/src" path.'
                                              'Useful when working in debug mode and source maps.')
flags.defineBoolean('log-requests', false, 'Log to STDOUT all requests, in apache like way.')
flags.parse()

app = express()
oneDay = 86400000

app.use(logger()) if flags.get('log-requests')
app.use(compression())

app.use('/static', express.static(__dirname + '/dist', { maxAge: oneDay }))
app.use '/', (req, res, next)->
    res.set('Content-Type', 'text/html')
    res.sendfile(__dirname + '/dist/index.html')

# thanks to serve /src we can see coffee script sources
# in chrome debug console.
if flags.get('serve-src-files')
    app.use('/src', express.static(__dirname + '/src', { maxAge: oneDay }))
    console.warn 'Serving "/src/*" files too - it SHOULD NOT happen on production server!'

app.listen(3000)
