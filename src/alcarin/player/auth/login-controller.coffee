angular.module('alcarin')
    .controller 'LoginController', ($scope, socket)->
        $scope.test = ->
            socket.emit('game.getinfo', {test: '3232'})
                .then (data)->
                    console.log 'response: ', data
                .catch 'validation.failed', (err)->
                    console.log 'validation problem', err.msg
                .catch (err)->
                    console.log 'other'
