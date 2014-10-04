alcarin.controller 'GamePanelController',

class GamePanelController
    constructor: (@$scope, @socket, @$stateParams)->

    talkToAll: ->
        @$scope.$emit('show-errors-check-validity')
        if @$scope.sayingForm.$valid
            @saying = ''
