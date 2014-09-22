alcarin
    .config ($routeProvider, $locationProvider)->
        $routeProvider
        .when '/',
            templateUrl: '/static/alcarin/player/home/home.html'
            controllerAs: 'MainCtrl'
            controller: 'HomeController'
            permissions: 'LOGGED'
        .when '/game-panel/:charId',
            templateUrl: '/static/alcarin/player/game-panel/main.html'
            controllerAs: 'GamePanelCtrl'
            controller: 'GamePanelController'
            permissions: 'LOGGED'
        .when '/char/create',
            templateUrl: '/static/alcarin/player/char/create-char.html'
            controllerAs: 'CreateCharCtrl'
            controller: 'CreateCharController'
            permissions: 'LOGGED'
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
        # .when '/public',
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

                if not Permissions.has(permissions)
                    $location.path('/public')


