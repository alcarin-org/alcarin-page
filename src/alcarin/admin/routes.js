angular.module('alcarin.admin')
.config(function ($stateProvider) {
    $stateProvider
    .state('manage-players', {
        url: '/players',
        templateUrl: 'alcarin/admin/players.html',
        permissions: 'MANAGING_PLAYERS',
        controller: 'PlayersController',
        controllerAs: 'PlayersCtrl',
    });
});
