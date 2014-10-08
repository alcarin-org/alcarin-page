alcarin.controller 'GamePanelController',

class GamePanelController
    constructor: (@$scope, @socket, @$stateParams)->

    talkToAll: ->
        if @$scope.sayingForm.$valid
            @socket.emit('char.saying', @saying)
            @saying = ''
