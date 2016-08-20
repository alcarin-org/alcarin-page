angular.module('alcarin.common')
    .factory('socket', socketIoFactory);

function socketIoFactory($rootScope, $localStorage, ioSocket) {

    const socketBaseEmit = ioSocket.emit.bind(ioSocket);
    const socket = _.assign(ioSocket, {
        on: socketHandlerToStream(),
        once: socketHandlerToStream(true),
        emit: socketEmit,
    });

    return socket;

    function socketEmit(eventName, data = {}) {
        console.log(`sending "${eventName}"`);
        socketBaseEmit(eventName, _.assign(data, {
            __apitoken: $localStorage.apiToken,
        }));

        return socket.once(`${eventName}:reply`);
    }

    function socketHandlerToStream(onceEmitOnly=false) {
        return function socketOn(eventName) {
            const eventStream = Kefir.fromEvents(socket, eventName)
                .withHandler(transformSocketResponse)
                .onAny(() => $rootScope.$evalAsync());

            handleDefaultErrors(eventStream);

            return eventStream;

            function transformSocketResponse(emitter, event) {
                if (event.type !== 'value') {
                    console.err('Some unexcepted behaviour in sockets', event);
                    return;
                }

                if(event.value && event.value.error) {
                    emitter.error(event.value.error);
                } else {
                    emitter.emit(event.value);
                }
                if (onceEmitOnly) {
                    emitter.end();
                }
            }

            function handleDefaultErrors(eventStream) {
                eventStream
                    .filterErrors((err) => err.reason === 'validation.failed')
                    .onError(socketValidationFailed);

                eventStream
                    .filterErrors((err) => err.reason !== 'validation.failed')
                    .onError(socketErrorsLogger);

                function socketValidationFailed(err) {
                    console.warn(
                        '"validation.failed": Need better validation add client side!',
                        err.body
                    );
                    throw err;
                }

                function socketErrorsLogger(err) {
                    console.log(`System "${err.reason}" error: ${err.body}`);
                }
            }


        };
    }
}
