$(function bootstrapWebpage() {
    const ApiServer = ':8888';
    const PublicPermission = [1];

    /**
     * Configure connection to socket.io and check user privilages.
     * before this we dont load angularjs - so routing wont be called
     * before privilages are known
     */
    var ioSocket = io.connect(ApiServer);
    ioSocket.once('alcarin.init', onInitMsg);

    function onInitMsg(options) {
        angular.module('alcarin')
            .value('ioSocket', ioSocket)
            .value('PermissionsDefTable', options.permissions);

        /**
         * if we have api token in local storage
         * use it to restore user privilages after reconnection
         */
        const apiToken = JSON.parse(localStorage.getItem('ngStorage-apiToken'));

        if (apiToken) {
            ioSocket.emit('auth.verifyToken', {__apitoken: apiToken});
            ioSocket.once('auth.verifyToken:reply', onVerifyToken);
        } else {
            setInitPermission(PublicPermission);
            bootstrapAngular();
        }

        function onVerifyToken(response) {
            if (response.error) {
                onTokenError(response.error);
            } else {
                setInitPermission(response.permissions);
                console.log('User permissions confirmed on server.');
            }
            bootstrapAngular();
        }
        function onTokenError(err) {
            setInitPermission(PublicPermission);
            if (err.reason === 'invalid.token') {
                console.warn('Wrong token used.');
                localStorage.removeItem('ngStorage-apiToken');
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
