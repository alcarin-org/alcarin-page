angular.module('alcarin')
.config(function ($stateProvider) {
    $stateProvider
    .state('gamepanel.home', {
        url: '/home',
        templateUrl: 'alcarin/game-panel/home/index.html',
        permissions: 'LOGGED'
    }).state('gamepanel.chars', {
        url: '/chars',
        templateUrl: 'alcarin/game-panel/chars/index.html',
        permissions: 'LOGGED'
    });
});
