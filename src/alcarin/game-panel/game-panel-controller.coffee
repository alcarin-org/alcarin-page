alcarin.controller 'GamePanelController',

class GamePanelController
    constructor: (@$scope, @socket, @$stateParams)->
        data = {charId: @$stateParams.charId}
        @socket.emit('char.activate', data).then =>
            @activate = true

    talkToAll: ->
        if @$scope.sayingForm.$valid
            @socket.emit('char.say', {content: @saying})
            .then => @saying = ''
