alcarin.controller 'LoginController',
class LoginController
    email: ''
    password: ''

    constructor: (@$scope, @socket, @UserPermissions, @$location)->
        @loginInvalid = false

    login: ->
        @$scope.$broadcast('show-errors-check-validity')
        if @$scope.form.$valid
            @socket.emit 'auth.login',
                email: @email,
                password: @password
            .then (response)=>
                {token, permissions} = response
                @UserPermissions.set(permissions)
                localStorage.setItem('apiToken', token)
                @$location.path '/'
                @loginInvalid = false
            .catch 'authorization.failed', (msg)=>
                @loginInvalid = true

