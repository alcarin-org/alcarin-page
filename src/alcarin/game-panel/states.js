angular.module('alcarin')
.config(function ($stateProvider) {
    $stateProvider
    .state('gamepanel.home', {
        url: '/home',
        templateUrl: '/static/alcarin/game-panel/home/index.html',
        permissions: 'LOGGED'
    }).state('gamepanel.chars', {
        url: '/chars',
        templateUrl: '/static/alcarin/game-panel/chars/index.html',
        permissions: 'LOGGED'
    });
});
