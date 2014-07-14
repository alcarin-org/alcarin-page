angular.module('alcarin')
    .config ($routeProvider, $locationProvider)->
        $routeProvider
        .when '/login',
            templateUrl: '/static/alcarin/player/auth/login.html',
            controller: 'LoginController'
        .otherwise
            redirectTo: '/login'

        $locationProvider.html5Mode(true)
