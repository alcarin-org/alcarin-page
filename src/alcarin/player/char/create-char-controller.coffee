alcarin.controller 'CreateCharController',

class CreateCharController
    constructor: (@socket, @$state)->
        @char = {}

    createChar: ->
        @socket.emit('player.create-char', @char).then =>
            @$state.go('home')
