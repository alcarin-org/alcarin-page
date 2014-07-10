angular.module('alcarin')
    .controller 'LoginController', ($scope, socket)->
        $scope.test = ->
            socket.emit 'game.getinfo'
