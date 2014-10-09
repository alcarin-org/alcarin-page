alcarin.controller 'GamePanelController',

class GamePanelController
    constructor: (@$scope, @socket, @$stateParams, @$state)->
        data = {charId: @$stateParams.charId}
        @socket.emit('char.activate', data)
        .then =>
            @activate = true
        .catch 'permission.denied', =>
            @$state.go('home')
        .catch 'validation.failed', =>
            @$state.go('home')


    talkToAll: ->
        if @$scope.sayingForm.$valid
            @socket.emit('char.say', {content: @saying})
            .then =>
                @saying = ''
