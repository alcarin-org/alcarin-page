angular.module('alcarin')
    .config ($routeProvider, $locationProvider)->
        $routeProvider
        .when '/',
            templateUrl: '/static/alcarin/player/main/index.html',
            controller: 'MainPageController'
            permissions: 'LOGGED'
        .when '/login',
            templateUrl: '/static/alcarin/player/auth/login.html',
            controller: 'LoginController'
            permissions: 'PUBLIC'
        # .when '/home',
        # need basic home page, when user can know about game and login/register
        .otherwise
            redirectTo: '/login'
            permissions: 'PUBLIC'

        $locationProvider.html5Mode(true)

    .run ($rootScope, $location, Permissions)->
        $rootScope.$on '$routeChangeStart', (event, next, current)->
            if next?.$$route
                permissions = next.$$route.permissions
                if not permissions?
                    $location.path('/')
                    throw Error("""
                    Route '#{next.$$route.originalPath}' have not permissions flag set.
                    Any route need have required permissions defined.
                    """)

                console.log permissions, Permissions.has(permissions)
                if not Permissions.has(permissions)
                    $location.path('/home')



