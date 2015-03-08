angular.module('alcarin').controller('GamePanelController', GamePanelController);

function GamePanelController(
    $scope, socket, $stateParams, $state, EventsManager
) {
    var vm = this;

    vm.activateCharacter = function () {
        var data = {
            charId: $stateParams.charId
        };
        return socket.emit('char.activate', data)
            .then(function () {
                vm.activate = true;
            })
            .catch('permission.denied', function () {
                $state.go('home');
            })
            .catch('validation.failed', function () {
                $state.go('home');
            });
    };

    vm.loadEvents = function () {
        socket.emit('char.events').then(function (events) {
            vm.gameEvents = events.map(function (ev) {
                return EventsManager.split(ev);
            });
        });
    };

    vm.talkToAll = function () {
        if ($scope.sayingForm.$valid) {
            socket.emit('char.say', {content: vm.saying})
            .then(function () {
                vm.saying = '';
                // # temporary
                vm.loadEvents();
            });
        }
    };

    vm.activateCharacter().then(function () {
        vm.loadEvents();
    });
}
