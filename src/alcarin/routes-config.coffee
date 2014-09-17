angular.module('alcarin')
    .config ($routeProvider, $locationProvider)->
        $routeProvider
        .when '/login',
            templateUrl: '/static/alcarin/player/auth/login.html',
            controller: 'LoginController'
            privilages: 1
        .otherwise
            redirectTo: '/login'
            privilages: 2

        $locationProvider.html5Mode(true)

    .run ($rootScope, $location)->
        $rootScope.$on '$routeChangeStart', (event, next, current)->
            # console.log next
            # if $rootScope.loggedUser is null
            #     $location.path('/login')


