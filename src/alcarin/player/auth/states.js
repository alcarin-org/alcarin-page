angular.module('alcarin')
.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('register', {
        url: '/register',
        templateUrl: '/static/alcarin/player/auth/register.html',
        controllerAs: 'RegisterCtrl',
        controller: 'RegisterController',
        permissions: 'PUBLIC'
    }).state('login', {
        url: '/login',
        templateUrl: '/static/alcarin/player/auth/login.html',
        resolve: {
            logout: function () { return false; }
        },
        controllerAs: 'LoginCtrl',
        controller: 'LoginController',
        permissions: 'PUBLIC'
    }).state('logout', {
        url: '/logout',
        resolve: {
            logout: function () { return true; }
        },
        template: '',
        controller: 'LoginController',
        permissions: 'LOGGED'
    });
});
