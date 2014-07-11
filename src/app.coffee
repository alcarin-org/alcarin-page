"use strict"

# this file should export all needed project front-end js dependencies.
# grunt build will paste dependencies from npm there.
main = ->
    require 'angular'
    require 'angular-bootstrap'
    require 'angular-route'
    require 'angular-socket-io'

    window.io      = require 'socket.io-client'
    window.Promise = require 'bluebird'

    # override blubird default 'catch' method to support error reason catch filtering.
    # example:
    # promise
    #  .then(...)
    #  .catch('validation.error', (err)-> console.log('validate problem'))
    #  .catch( (err)-> console.log('other problem'))
    promiseCatch = Promise::catch
    Promise::catch = (type, err)->
        if typeof type is 'string'
            return promiseCatch.call(@, ((err)-> err.reason is type), err)
        else
            err = type
            return promiseCatch.call(@, err)

    $('html').removeClass('no-js').addClass('js')

    angular.module('alcarin', ['ngRoute', 'btford.socket-io'])
        .config ($routeProvider, $locationProvider)->
            $routeProvider.
            when('/login', {
                templateUrl: '/static/alcarin/player/auth/login.html',
                controller: 'LoginController'
            }).
            otherwise
                redirectTo: '/login'

            $locationProvider.html5Mode(true)

        .factory 'socket', (socketFactory)->
            # prepare server socket.io connection
            # override default socket.emit so it return a bluebird promise that have
            # resolved when (and if only) server send acknowledgements response for this
            # specific emit.
            ioSocket = io.connect('http://localhost:8888')
            socket = socketFactory({ioSocket})
            socket._emit = socket.emit
            socket.emit = (args...)->
                promise = new Promise (resolve, reject)->
                    args.push (response)->
                        return reject(response.error) if response.error
                        resolve(response)
                    socket._emit.apply(socket, args)

                return promise
            return socket

        .run ($rootScope)->
            # lets make bluebird promises start angularjs digest process
            Promise.setScheduler (cb)-> $rootScope.$evalAsync(cb)
main()
