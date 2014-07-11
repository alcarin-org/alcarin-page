angular.module('alcarin')
    .controller 'LoginController', ($scope, socket)->
        $scope.loginInvalid = false
        $scope.login = ->
            $scope.$broadcast('show-errors-check-validity')
            if $scope.form.$valid
                socket.emit 'auth.login',
                    email: $scope.email,
                    password: $scope.password
                .then (response)->
                    {token} = response
                    localStorage.setItem('apiToken', token)
                    $scope.loginInvalid = false
                .catch 'authorization.failed', (msg)->
                    $scope.loginInvalid = true

