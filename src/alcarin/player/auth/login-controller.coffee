angular.module('alcarin')
    .controller 'LoginController', ($scope, socket)->
        $scope.test = ->
            socket.emit('game.getinfo', 'raz', 'dwa')
                .then (data)->
                    console.log 'response: ', data
                .catch 'validation.failed', (err)->
                    console.log 'validation problem'
                .catch (err)->
                    console.log 'other'
