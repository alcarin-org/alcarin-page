angular.module('alcarin')
.config(function ($stateProvider, $locationProvider) {
    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'alcarin/player/home/home.html',
        controllerAs: 'HomeCtrl',
        controller: 'HomeController',
        permissions: 'LOGGED'
    })
    .state('gamepanel', {
        url: '/game-panel/:charId',
        templateUrl: 'alcarin/game-panel/layout.html',
        controllerAs: 'GamePanelCtrl',
        controller: 'GamePanelController',
        resolve: {
            charEnv: prepareCharacterEnvironment
        },
        permissions: 'LOGGED'
    })
    .state('create-char', {
        url: '/char/create',
        templateUrl: 'alcarin/player/char/create-char.html',
        controllerAs: 'CreateCharCtrl',
        controller: 'CreateCharController',
        permissions: 'LOGGED'
    })
    .state('color-palette', {
        url: '/palette',
        templateUrl: 'layout/color-palette.html',
        permissions: 'PUBLIC'
    });
    // # .when '/public',
    // # need basic home page, when user can know about game and login/register
    // # .otherwise
    // #     redirectTo: '/login'
    // #     permissions: 'PUBLIC'

    $locationProvider.html5Mode(true);
})
.run(function ($rootScope, $state, Permissions) {
    var onStateChange = function onStateChange(event, next) {
        if (next) {
            var permissions = next.permissions;
            if (!permissions) {
                $state.go('home');
                event.preventDefault();
                throw Error(sprintf(
                    'Route %s have not permissions flag set.' +
                    'Any route need have required permissions defined.',
                    next.$$route.originalPath
                ));
            }

            if (!Permissions.has(permissions)) {
                $state.go('login');
                event.preventDefault();
            }
        }
    };
    $rootScope.$on('$stateChangeStart', onStateChange);
});


prepareCharacterEnvironment.$inject = [
    '$state', '$stateParams', 'CharEnvironment'
];
function prepareCharacterEnvironment($state, $stateParams, CharEnvironment) {
    return CharEnvironment.factory($stateParams.charId)
        .onError('permission.denied', function () {
            $state.go('home');
        })
        .onError('validation.failed', function () {
            $state.go('home');
        })
        .toPromise();
}
