alcarin
    .config ($routeProvider, $locationProvider)->
        $routeProvider
        .when '/register',
            templateUrl: '/static/alcarin/player/auth/register.html'
            controllerAs: 'RegisterCtrl'
            controller: 'RegisterController'
            permissions: 'PUBLIC'
        .when '/login',
            resolve: {logout: -> false}
            templateUrl: '/static/alcarin/player/auth/login.html'
            controllerAs: 'LoginCtrl'
            controller: 'LoginController'
            permissions: 'PUBLIC'
        .when '/logout',
            resolve: {logout: -> true}
            template: ''
            controller: 'LoginController'
            permissions: 'LOGGED'

