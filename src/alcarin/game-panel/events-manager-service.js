angular.module('alcarin').service('EventsManager', EventsManager);

var EVENTS_REG = /\$([A-Za-z0-9]+)/g;

function EventsManager() {}

EventsManager.prototype.split = function (gameEvent) {
        // # split game-event at logical parts.
        // # parts can be 'text' or gameobject of many types
        var text = gameEvent.content;
        var output = [];
        var offset = 0;
        var _text  = '';
        var match, argName, arg, preText;
        while ((match = EVENTS_REG.exec(text))) {
            argName = match[1];
            arg = gameEvent.args[argName];
            if (angular.isUndefined(arg)) {
                continue;
            }

            if (match.index > offset) {
                _text = text.slice(offset, match.index);
                preText = _text.slice(offset, match.index);
                output.push({text: preText, type: 'text'});
            }

            output.push(arg);
            offset = match.index + match[0].length;
        }
        if (offset < text.length) {
            output.push({text: text.slice(offset), type: 'text'});
        }

        return {
            body: output,
            time: gameEvent.time
        };
};
