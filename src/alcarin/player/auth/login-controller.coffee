alcarin.controller 'LoginController',
class LoginController
    email: ''
    password: ''
    constructor: (@$scope, @socket, @UserPermissions, @$state, logout)->
        @loginInvalid = false
        @logout() if logout

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
                @$state.go 'home'
                @loginInvalid = false
            .catch 'authorization.failed', (msg)=>
                @loginInvalid = true

    logout: ->
        @UserPermissions.set([])
        localStorage.removeItem('apiToken')
        @$state.go 'home'
