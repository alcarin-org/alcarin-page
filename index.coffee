"use strict"

express     = require 'express'
compression = require 'compression'
flags       = require 'flags'

flags.defineBoolean('serve-src-files', false, 'Serve coffeescript and less files on "/src" path.'
                                              'Useful when working in debug mode and source maps.')
flags.parse()

app = express()
oneDay = 86400000

app.use(compression())
app.use '/', (req, res, next)->
    path = req.url or '/index.html'
    fpath = __dirname + '/dist' + path
    res.sendfile fpath, (err)->
        res.sendfile(__dirname + '/dist/index.html') if err

# thanks to serve /src we can see coffee script sources
# in chrome debug console.
if flags.get('serve-src-files')
    app.use('/src', express.static(__dirname + '/src', { maxAge: oneDay }))
    console.warn 'Serving "/src/*" files too - it SHOULD NOT happen on production server!'

app.listen(3000)
