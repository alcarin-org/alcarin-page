/**
 * replace socket.on and socket.emit methods to return Kefir streams instead
 * of working with callbacks
 */
(function (socketBaseOn, socketBaseEmit) {
    var socketProto = io.Socket.prototype;
    _.assign(socketProto, {
        _schedulerCallback: _.noop,
        on: socketHandlerToStream(),
        once: socketHandlerToStream(true),
        emit: socketEmit,
        setScheduler: setSocketScheduler
    });

    function socketEmit(...args) {
        var socket = this;

        socketBaseEmit.apply(socket, args);

        var socketReplyEvent = _.first(args) + ':reply';
        return socket.once(socketReplyEvent);
    }

    function socketHandlerToStream(onceEmitOnly=false) {
        return function socketOn(...args) {
            var socket    = this;
            var eventName = _.first(args);

            var stream = Kefir.fromEvents(
                socket, eventName
            ).withHandler(
                (emitter, event) => {
                    if (event.type === 'value') {
                        if(event.value && event.value.error) {
                            return emitter.error(event.value.error);
                        }
                        return emitter.emit(event.value);
                    }
            }).onAny(socket._schedulerCallback);

            stream
                .filterErrors((err) => err.reason === 'validation.failed')
                .onError(socketValidationFailed);

            return onceEmitOnly ? stream.take(1) : stream;
        };
    }

    function socketValidationFailed(err) {
        console.warn(
            '"validation.failed": Need better validation add client side!',
            err.body
        );
        throw err;
    }

    function setSocketScheduler(schedulerCallback) {
        this._schedulerCallback = schedulerCallback;
    }
})(io.Socket.prototype.on, io.Socket.prototype.emit);

