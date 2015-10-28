/*
 * how to use system event bus?
 *
 * // creating object inherit from EventsBus
 * var myObject = _.create(window.EventsBus, {
 *     myFn: (x) => x
 * });
 *
 * myObject.on('test', () => alert(5));
 * myObject.emit('test'); //alert(5)!
 */

var EventsBus = {
    __listeners() {
        if (_.isUndefined(this.__eventHandlers)) {
            this.__eventHandlers = {};
        }
        return this.__eventHandlers;
    },

    on(eventName, callback) {
        var __listeners = this.__listeners();

        if (!(eventName in __listeners)) {
          __listeners[eventName] = [];
        }
        return __listeners[eventName].push(callback);
    },

    emit(...args) {
        var __listeners = this.__listeners();
        var [eventName, ...eventArgs] = args;

        if (eventName in __listeners) {
            _.forEach(
                __listeners[eventName],
                (handler) => handler.apply(this, eventArgs)
            );
        }

        // call asterix, if any registered
        if ('*' in __listeners) {
            _.forEach(
                __listeners['*'],
                (handler) => handler.apply(this, args)
            );
        }
    }
};

window.EventsBus = EventsBus;
