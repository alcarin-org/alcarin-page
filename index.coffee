"use strict"

express     = require 'express'
compression = require 'compression'
flags       = require 'flags'

flags.defineBoolean('serve-debug-files', false, 'Serve coffeescript and less files on "/src" path.'
                                                'Useful when working in debug mode and source maps.')
flags.parse()

app = express()
oneDay = 86400000

app.use(compression())
app.use(express.static(__dirname + '/public', { maxAge: oneDay }))

# thanks to serve /src we can see coffee script sources
# in chrome debug console.
if flags.get('serve-debug-files')
    app.use('/src', express.static(__dirname + '/src', { maxAge: oneDay }))

app.listen(3000)
