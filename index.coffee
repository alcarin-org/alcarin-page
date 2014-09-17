"use strict"

express     = require 'express'
compression = require 'compression'
flags       = require 'flags'
logger      = require 'morgan'
livereload  = require 'connect-livereload'

flags.defineBoolean('serve-src-files', false, 'Serve coffeescript and less files on "/src" path.
    Useful when working in debug mode and source maps.')
flags.defineBoolean('log-requests', false, 'Log to STDOUT all requests, in apache like way.')
flags.defineBoolean('inject-livereload', false, 'Inject livereload client script to page.')
flags.parse()

app    = express()
oneDay = 86400000
port   = 3000

app.use(logger()) if flags.get('log-requests')
app.use(compression())

if flags.get('inject-livereload')
    # inject livereload client to webbrowsers
    app.use(livereload({port: 35729}))

app.use('/static', express.static(__dirname + '/dist', { maxAge: oneDay }))

# thanks to serve /src we can see coffee script sources
# in chrome debug console.
if flags.get('serve-src-files')
    app.use('/src', express.static(__dirname + '/src', { maxAge: oneDay }))
    console.warn 'Serving "/src/*" files too - it SHOULD NOT happen on production server!'

app.use('/bower_components', express.static(__dirname + '/bower_components', { maxAge: oneDay }))
app.use '/', (req, res, next)->
    res.set('Content-Type', 'text/html')
    res.sendFile(__dirname + '/dist/index.html')

app.listen(port)
console.log "Server listening on port #{port}."
