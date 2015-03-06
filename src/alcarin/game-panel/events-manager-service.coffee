EVENTS_REG = /\$([A-Za-z0-9]+)/g

angular.module('alcarin').service 'EventsManager',
class EventsManager
    constructor: ->

    split: (gameEvent)->
        console.log gameEvent
        # split game-event at logical parts.
        # parts can be 'text' or gameobject of many types
        text = gameEvent.content
        output = []
        offset = 0
        _text  = ''
        while match = EVENTS_REG.exec(text)
            argName = match[1]
            arg = gameEvent.args[argName]
            continue if not arg?

            if match.index > offset
                _text = text[offset...match.index]
                preText = _text[offset...match.index]
                output.push {text: preText, type: 'text'}

            output.push(arg)
            offset = match.index + match[0].length

        if offset < text.length
            output.push({text: text[offset..], type: 'text'})

        return {
            body: output
            time: gameEvent.time
        }
