alcarin
    .config ($stateProvider, $locationProvider)->
        $stateProvider
        .state 'home',
            url: '/'
            templateUrl: '/static/alcarin/player/home/home.html'
            controllerAs: 'MainCtrl'
            controller: 'HomeController'
            permissions: 'LOGGED'
        .state 'gamepanel',
            url: '/game-panel/:charId'
            templateUrl: '/static/alcarin/player/game-panel/main.html'
            controllerAs: 'GamePanelCtrl'
            controller: 'GamePanelController'
            permissions: 'LOGGED'
        .state 'create-char',
            url: '/char/create'
            templateUrl: '/static/alcarin/player/char/create-char.html'
            controllerAs: 'CreateCharCtrl'
            controller: 'CreateCharController'
            permissions: 'LOGGED'
        # .when '/public',
        # need basic home page, when user can know about game and login/register
        # .otherwise
        #     redirectTo: '/login'
        #     permissions: 'PUBLIC'

        $locationProvider.html5Mode(true)

    .run ($rootScope, $state, Permissions)->
        $rootScope.$on '$stateChangeStart', (event, next, nextParams)->
            if next?
                permissions = next.permissions
                if not permissions?
                    $state.go('home')
                    event.preventDefault()
                    throw Error("""
                    Route '#{next.$$route.originalPath}' have not permissions flag set.
                    Any route need have required permissions defined.
                    """)

                if not Permissions.has(permissions)
                    $state.go('login')
                    event.preventDefault()


