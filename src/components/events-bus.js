/*
 * how to use system event bus?
 *
 * //creating object
 * function MyObject(){};
 * //inherit from EventsBus
 * MyObject.prototype = new EventsBus();
 *
 * var test = new MyObject();
 * test.on('test', function() { alert(5); } );
 * test.emit('test'); //alert(5)!
 */

var __slice = Array.prototype.slice;

function EventsBus() {
    this.listeners = {};
}

EventsBus.prototype.on = function(eventName, callback) {
    if (this.listeners[eventName] === undefined) {
      this.listeners[eventName] = [];
    }
    return this.listeners[eventName].push(callback);
};

EventsBus.prototype.emit = function(eventName) {
    var li, args = [];
    if(arguments.length > 1) {
        args = __slice.call(arguments, 1);
    }

    var __listeners = this.listeners[eventName];
    if(__listeners !== undefined) {
        for(li = 0; li < __listeners.length; li++) {
            __listeners[li].apply(this, args);
        }
    }

    // call asterix, if any registered
    __listeners = this.listeners['*'];
    if(__listeners !== undefined) {
        for(li = 0; li < __listeners.length; li++) {
            __listeners[li].apply(this, [eventName].concat(args));
        }
    }
};

window.EventsBus = EventsBus;
