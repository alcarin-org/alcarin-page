alcarin.controller 'HomeController',

class HomeController

    constructor: (@socket)->
        @socket.emit('player.fetch-chars').then (chars)=>
            @chars = chars
