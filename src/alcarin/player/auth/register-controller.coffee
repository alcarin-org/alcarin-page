alcarin.controller 'RegisterController',
class RegisterController

    constructor: (@socket, @$location, @UserPermissions)->

    registerUser: ->
        @emailOccupied = false
        @socket.emit 'auth.create-player', {
            email: @email
            password: @password1
        }
        .then (response)=>
            {token, permissions} = response
            @UserPermissions.set(permissions)
            localStorage.setItem('apiToken', token)
            @$location.path('/')
        .catch 'email.occupied', => @emailOccupied = true


