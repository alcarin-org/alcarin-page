alcarin.controller 'LoginController', ($scope, $rootScope, socket, UserPermissions)->
    $scope.loginInvalid = false

    $scope.login = ->
        $scope.$broadcast('show-errors-check-validity')
        if $scope.form.$valid
            socket.emit 'auth.login',
                email: $scope.email,
                password: $scope.password
            .then (response)->
                {token, permissions} = response
                UserPermissions.set(permissions)
                $rootScope.$broadcast('userPermissions.updated')
                localStorage.setItem('apiToken', token)
                $scope.loginInvalid = false
            .catch 'authorization.failed', (msg)->
                $scope.loginInvalid = true

