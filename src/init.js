var API_SERVER = ':8888';

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

    var userPermissions = _.create(window.EventsBus, {
        permissions: [],

        has(code) {
            return this.permissions.indexOf(code) !== -1;
        },
        get() {
            return this.permissions;
        },
        set(val) {
            this.permissions = val;
            this.emit('updated');
        }
    });

    angular.module('alcarin').value('UserPermissions', userPermissions);
    ioSocket.once('alcarin.init').onValue(onInitMsg);

    function onInitMsg(options) {
        angular.module('alcarin')
            .value('ioSocket', ioSocket)
            .value('PermissionsTable', options.permissions);

        if (apiToken) {
            ioSocket.emit('auth.verifyToken', {token: apiToken})
                .onValue(onVerifyToken)
                .onError(onTokenError)
                .onAny(bootstrapAngular);
        }
        else {
            bootstrapAngular();
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

    function bootstrapAngular() {
        angular.bootstrap(document.body, ['alcarin']);
    }
});
