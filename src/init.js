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
            setInitPermission([]);
            bootstrapAngular();
        }

        function onVerifyToken(response) {
            setInitPermission(response.permissions);
            console.log('User permissions confirmed on server.');
        }
        function onTokenError(err) {
            setInitPermission([]);
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

    function setInitPermission(permissions) {
        angular.module('alcarin').constant(
            'InitUserPermissions',
            permissions
        );
    }
});
