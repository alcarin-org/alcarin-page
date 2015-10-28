angular.module('alcarin.game-panel')
    .controller('GamePanelController', GamePanelController);

function GamePanelController(
    $scope, socket, $stateParams, $state, EventsManager, Stream
) {
    var vm = this;

    _.assign(vm, {
        talkToAll: Stream.emitter(),
        reloadView: reloadView,
        states: [
            {name: 'gamepanel.home', icon: 'fa-home'},
            {name: 'gamepanel.chars', icon: 'fa-users'},
        ]
    });

    Stream.fromNgEvent($scope, '$stateChangeSuccess')
          .onValue(stateChanged);

    var charEvents = socket.on('char.events:reply');
    var charSayed  = socket.on('char.say:reply');

    vm.talkToAll
        .filter(_.negate(_.isUndefined))
        .onValue(
            () => socket.emit('char.say', {content: vm.saying})
        );

    charSayed
        .onValue(() => {
            loadEvents();
            vm.saying = '';
        });

    charEvents
        .onValue(() => vm.gameEvents = [])
        .flatten()
        .map((event) => EventsManager.split(event))
        .onValue(
            (gameEvent) => vm.gameEvents.push(gameEvent)
        );

    activate();

    ///

    function activate() {
        loadEvents();
    }

    function loadEvents() {
        socket.emit('char.events');
    }

    function stateChanged({data: [state]}) {
        vm.currentState = state.name;
    }

    function reloadView(view) {
        vm.controlPanelFocus = true;
        $state.go(view);
    }
}
