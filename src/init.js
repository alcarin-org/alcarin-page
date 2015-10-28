var API_SERVER = 'http://localhost:8888';

angular.module('alcarin')
.run(function ($rootScope, socket) {
    socket.emit('game.gametime')
        .onValue(
            (gt) => $rootScope.gametime = gt.timestamp
        );
});

$(function bootstrapWebpage() {
    // ###
    // Configure connection to socket.io and check user privilages.
    // before this we dont load angularjs - so routing wont be called
    // before privilages are known.
    // ###
    var ioSocket = io.connect(API_SERVER);
    // # if we have api token in local storage
    // # use it to restore user privilages after reconnection
    var apiToken = JSON.parse(localStorage.getItem('ngStorage-apiToken'));
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
    ioSocket.once('alcarin.init').onValue(onInitMsg);

    function onInitMsg(options) {
        console.log(options);
        angular.module('alcarin')
            .value('ioSocket', ioSocket)
            .value('PermissionsTable', options.permissions);

        if (apiToken) {
            ioSocket.emit('auth.verifyToken', {token: apiToken})
                .onValue(onVerifyToken)
                .onError(onTokenError)
                .onAny(bootstrapFn);
        }
        else {
            bootstrapFn();
        }

        function onVerifyToken(response) {
            userPermissions.set(response.permissions);
            console.log('User permissions confirmed on server.');
        }
        function onTokenError(err) {
            if (err.reason === 'invalid.token') {
                console.warn('Wrong token used.');
                localStorage.removeItem('apiToken');
            } else {
                console.warn('Auth token verification failed', err);
            }
        }
    }
});
