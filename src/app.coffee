"use strict"

###
this file is always compiling first.

override blubird default 'catch' method to support error reason catch filtering.
example:
promise
 .then(...)
 .catch('validation.error', (err)-> console.log('validate problem'))
 .catch( (err)-> console.log('other problem'))
###
promiseCatch = Promise::catch
Promise::catch = (type, err)->
    if typeof type is 'string'
        return promiseCatch.call(@, ((err)-> err.reason is type), err)
    else
        err = type
        return promiseCatch.call(@, err)

# just tell the world that JS is enabled - by class.
$('html').removeClass('no-js').addClass('js')

API_SERVER = 'http://localhost:8888'

angular.module('alcarin', [
    # angularjs routing extension
    'ngRoute',
    # socket.io cooperating with angularjs
    'btford.socket-io',
    # showErrors - bootstrap forms validation way with angularjs
    'ui.bootstrap.showErrors'
])

.factory 'socket', (socketFactory)->
    # prepare server socket.io connection
    # override default socket.emit so it return a bluebird promise that have
    # resolved when (and if only) server send acknowledgements response for this
    # specific emit.
    ioSocket = io.connect(API_SERVER)
    socket = socketFactory({ioSocket})
    socket._emit = socket.emit
    socket.emit = (args...)->
        promise = new Promise (resolve, reject)->
            args.push (response)->
                return reject(response.error) if response.error
                resolve(response)
            socket._emit.apply(socket, args)

        return promise

    # if we have api token in local storage
    # use it to restore user privilages after reconnection
    apiToken = localStorage.getItem('apiToken')
    if apiToken
        socket.emit 'auth.verifyToken', {token: apiToken}
        .then ->
            console.log 'User permissions confirmed on server.'
        .catch 'invalid.token', ->
            console.warn 'Wrong token used.'
            localStorage.removeItem('apiToken')
    return socket

.run ($rootScope)->
    # lets make bluebird promises start angularjs digest process
    Promise.setScheduler (cb)-> $rootScope.$evalAsync(cb)
