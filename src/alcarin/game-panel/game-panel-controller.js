angular.module('alcarin.game-panel')
    .controller('GamePanelController', GamePanelController);

function GamePanelController(
    $scope, socket, $stateParams, $state, EventsManager
) {
    var vm = this;

    _.assign(vm, {
        activateCharacter: activateCharacter,
        loadEvents: loadEvents,
        talkToAll: talkToAll,
        loadLocationDetails: loadLocationDetails,
        reloadView: reloadView,
        states: [
            {name: 'gamepanel.home', icon: 'fa-home'},
            {name: 'gamepanel.chars', icon: 'fa-users'},
        ]
    });

    $scope.$on('$stateChangeSuccess', stateChanged);

    activate();

    ///

    function activate() {
        vm.activateCharacter().then(function () {
            vm.loadEvents();
            vm.loadLocationDetails();
        });
    }

    function stateChanged(event, toState) {
        vm.currentState = toState.name;
    }

    function reloadView(view) {
        vm.controlPanelFocus = true;
        $state.go(view);
    }

    function activateCharacter() {
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
    }

    function loadEvents() {
        socket.emit('char.events').then(function (events) {
            vm.gameEvents = events.map(function (ev) {
                return EventsManager.split(ev);
            });
        });
    }

    function loadLocationDetails() {
        socket.emit('loc.details').then(function (loc) {
            console.log(loc);
        });
    }

    function talkToAll() {
        if ($scope.sayingForm.$valid) {
            socket.emit('char.say', {content: vm.saying})
            .then(function () {
                vm.saying = '';
                // # temporary
                vm.loadEvents();
            });
        }
    }
}
