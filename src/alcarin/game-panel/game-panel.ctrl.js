angular.module('alcarin.game-panel')
    .controller('GamePanelController', GamePanelController);

function GamePanelController(
    $scope, socket, $stateParams, $state, EventsManager, charEnv
) {
    var vm = this;
    console.log('env', charEnv);

    _.assign(vm, {
        loadEvents: loadEvents,
        talkToAll: talkToAll,
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
        vm.loadEvents();
    }

    function stateChanged(event, toState) {
        vm.currentState = toState.name;
    }

    function reloadView(view) {
        vm.controlPanelFocus = true;
        $state.go(view);
    }

    function loadEvents() {
        socket.emit('char.events').then(function (events) {
            vm.gameEvents = events.map(function (ev) {
                return EventsManager.split(ev);
            });
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
