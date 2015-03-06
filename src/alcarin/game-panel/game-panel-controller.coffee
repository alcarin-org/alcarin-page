alcarin.controller 'GamePanelController',

class GamePanelController
    constructor: (@$scope, @socket, @$stateParams, @$state, @EventsManager)->
        @activateCharacter().then =>
            @loadEvents()

    activateCharacter: ->
        data = {charId: @$stateParams.charId}
        return @socket.emit('char.activate', data)
            .then =>
                @activate = true
            .catch 'permission.denied', =>
                @$state.go('home')
            .catch 'validation.failed', =>
                @$state.go('home')

    loadEvents: ->
        @socket.emit('char.events').then (events)=>
            @gameEvents = (@EventsManager.split(ev) for ev in events)

    talkToAll: ->
        if @$scope.sayingForm.$valid
            @socket.emit('char.say', {content: @saying})
            .then =>
                @saying = ''
                # temporary
                @loadEvents()
