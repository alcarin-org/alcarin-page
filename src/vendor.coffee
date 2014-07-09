"use strict"

# this file should export all needed project front-end js dependencies.
# grunt build will paste dependencies from npm there.
require 'angular'
require 'angular-bootstrap'

window.Promise = require 'bluebird'

$('html').removeClass('no-js').addClass('js')
