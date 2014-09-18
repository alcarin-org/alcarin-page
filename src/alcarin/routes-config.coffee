angular.module('alcarin')
    .config ($routeProvider, $locationProvider)->
        $routeProvider
        .when '/login',
            templateUrl: '/static/alcarin/player/auth/login.html',
            controller: 'LoginController'
            permissions: 'PUBLIC'
        .otherwise
            redirectTo: '/login'
            permissions: 'PUBLIC'

        $locationProvider.html5Mode(true)

    .run ($rootScope, $location, Permissions)->
        $rootScope.$on '$routeChangeStart', (event, next, current)->
            if next.$$route
                permissions = next.$$route.permissions
                if not permissions?
                    $location.path('/')
                    throw Error("""
                    Route '#{next.$$route.originalPath}' have not permissions flag set.
                    Any route need have required permissions defined.
                    """)
                $location.path('/') if not Permissions.has(permissions)
            $location.path('/login') if $rootScope.loggedUser is null



