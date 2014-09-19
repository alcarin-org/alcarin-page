class EventsBus
    constructor: ->
        @listeners = {}

    on: (eventName, callback)->
        @listeners[eventName] or= []
        @listeners[eventName].push callback

    emit: (eventName, args...) ->
        __listeners = @listeners[eventName]
        if __listeners?
            callback.apply(this, args) for callback in __listeners

        # call asterix, if any registered
        __listeners = @listeners['*']
        if __listeners?
            asterixArgs = [eventName].concat(args)
            callback.apply(this, asterixArgs) for callback in __listeners
