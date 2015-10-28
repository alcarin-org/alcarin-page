angular.module('alcarin.common')
    .factory('socket', socketIoFactory);

function socketIoFactory($rootScope, ioSocket) {
    // prepare server socket.io connection
    // override default socket.emit so it return a bluebird promise that have
    // resolved when (and if only) server send acknowledgements response for this
    // specific emit.
    ioSocket.setScheduler((cb) => $rootScope.$evalAsync(cb));
    return ioSocket;
}
