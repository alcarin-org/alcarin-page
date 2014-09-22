alcarin.controller 'RegisterController',
class RegisterController

    constructor: (@socket)->

    registerUser: ->
        @errorDiffPass = @password1 != @password2
        console.log @errorDiffPass
        return if @errorDiffPass

