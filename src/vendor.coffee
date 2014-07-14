# this file should export all needed project front-end js dependencies.
# grunt build will paste dependencies from npm there.
require 'angular'
require 'angular-bootstrap'
require 'angular-route'
require 'angular-socket-io'
require 'angular-bootstrap-show-errors'

window.io      = require 'socket.io-client'
window.Promise = require 'bluebird'
