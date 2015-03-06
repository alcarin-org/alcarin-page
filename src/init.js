'use strict';

var catchFn = Promise.prototype.catch;
Promise.prototype.catch = function (type, err) {
    /*
    override blubird default 'catch' method to support error reason catch filtering.
    promise
     .then(...)
     .catch('validation.failed', (err)-> console.log('validate problem'))
     .catch( (err)-> console.log('other problem'))
    */
    if (typeof type === 'string') {
        return catchFn.call(this, function errTypeCheck(err) {
            return err.reason === type;
        }, err);
    }
    else {
        err = type;
        return catchFn.call(this, err);
    }
};

var API_SERVER = 'http://localhost:8888';

angular.module('alcarin')
.factory('socket', function (socketFactory, ioSocket) {
    // # prepare server socket.io connection
    // # override default socket.emit so it return a bluebird promise that have
    // # resolved when (and if only) server send acknowledgements response for this
    // # specific emit.
    var socket = socketFactory({ioSocket: ioSocket});
    socket._emit = socket.emit;

    var socketResponsePromise = function socketResponsePromise(resolve, reject) {
        Array.prototype.push.call(arguments, function (response) {
            if (response && response.error) {
                return reject(response.error);
            }
            resolve(response);
        });
        socket._emit.apply(socket, arguments);
    };
    var validationFailed = function validationFailed(data) {
        console.warn('"validation.failed": Need better validation add client side!', data.body);
        throw data;
    };
    socket.emit = function () {
        var promise = new Promise(socketResponsePromise);
        return promise.catch('validation.failed', validationFailed);
    };
    return socket;
})
.run(function ($rootScope, socket) {
    // # lets make bluebird promises start angularjs digest process
    Promise.setScheduler(function (cb) {
        return $rootScope.$evalAsync(cb);
    });
    socket.emit('game.gametime').then(function gameTimeObserver(gt) {
        $rootScope.gametime = gt.timestamp;
        console.log(gt.timestamp);
    });
});

$(function bootstrapSite() {
    // ###
    // Configure connection to socket.io and check user privilages.
    // before this we dont load angularjs - so routing wont be called
    // before privilages are known.
    // ###
    var ioSocket = io.connect(API_SERVER);
    // # if we have api token in local storage
    // # use it to restore user privilages after reconnection
    var apiToken = localStorage.getItem('apiToken');
    var bootstraped = false;
    var bootstrapFn = function bootstrapAngular() {
        if (!bootstraped) {
            angular.bootstrap(document.body, ['alcarin']);
        }
        bootstraped = true;
    };

    var UserPermissions = function UserPermissions() {
        this.permissions = [];
    };
    UserPermissions.prototype = angular.extend(new window.EventsBus(), {
        has: function userPermissionsGet(code) {
            return this.permissions.indexOf(code) !== -1;
        },
        get: function userPermissionsGet() {
            return this.permissions;
        },
        set: function userPermissionsSet(val) {
            this.permissions = val;
            this.emit('updated');
        }
    });

    var userPermissions = new UserPermissions();

    angular.module('alcarin').value('UserPermissions', userPermissions);
    var onVerifyToken = function (response) {
        if (response.error) {
            if (response.error === 'invalid.token') {
                console.warn('Wrong token used.');
                localStorage.removeItem('apiToken');
            }
            else {
                console.warn('Auth token verification failed', response.error);
            }
        }
        else {
            userPermissions.set(response.permissions);
            console.log('User permissions confirmed on server.');
        }
        bootstrapFn();
    };

    ioSocket.on('alcarin.init', function onInitMsg(options) {
        angular.module('alcarin')
            .value('ioSocket', ioSocket)
            .value('PermissionsTable', options.permissions);

        if (apiToken) {
            ioSocket.emit('auth.verifyToken', {token: apiToken}, onVerifyToken);
        }
        else {
            bootstrapFn();
        }
    });
});
