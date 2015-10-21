/**
 * replace socket.on and socket.emit methods to return Kefir streams instead
 * of working with callbacks
 */
(function (socketBaseOn, socketBaseEmit) {
    var socketProto = io.Socket.prototype;
    _.assign(socketProto, {
        on: socketFnHandler(socketBaseOn),
        emit: socketFnHandler(socketBaseEmit),
        setScheduler: setSocketScheduler
    });

    function setSocketScheduler(schedulerCallback) {
        this._schedulerCallback = schedulerCallback;
    }

    function socketFnHandler(baseFn) {
        return function socketOn(...args) {
            var socket = this;
            var stream = Kefir.stream(socketOnStream);
            stream.filterErrors(
                (err) => err.reason === 'validation.failed'
            ).onError(socketValidationFailed);

            return stream;

            function socketOnStream(emitter) {
                args.push(
                    socketStreamHandlerFactory.call(socket, emitter)
                );
                baseFn.apply(socket, args);
            }
        };
    }

    function socketValidationFailed(err) {
        console.warn(
            '"validation.failed": Need better validation add client side!',
            err.body
        );
        throw err;
    }

    function socketStreamHandlerFactory(emitter) {
        return function onSocketData(response) {
            if (this._schedulerCallback) {
                return this._schedulerCallback(socketHandler);
            }
            return socketHandler();

            function socketHandler() {
                if (response && response.error) {
                    return emitter.error(response.error);
                }
                emitter.emit(response);
            }
        };
    }
})(io.Socket.prototype.on, io.Socket.prototype.emit);

