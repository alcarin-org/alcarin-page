angular.module('alcarin.game-panel')
    .controller('GamePanelController', GamePanelController);

function GamePanelController(
    $scope, socket, $stateParams, $state, EventsManager, charEnv
) {
    var vm = this;

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
        vm.gameEvents = [];
        socket.emit('char.events')
            .flatten()
            .map((event) => EventsManager.split(event))
            // .bufferWhite()
            .onValue(
                (gameEvent) => vm.gameEvents.push(gameEvent)
            );
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
