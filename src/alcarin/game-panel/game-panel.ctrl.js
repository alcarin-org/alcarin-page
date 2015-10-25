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

    activate();

    ///

    function activate() {
        loadEvents();
    }

    function stateChanged({data: [state]}) {
        vm.currentState = state.name;
    }

    function reloadView(view) {
        vm.controlPanelFocus = true;
        $state.go(view);
    }

    function loadEvents() {
        // vm.gameEvents = [];
        socket.emit('char.events')
            .flatten()
            .map((event) => EventsManager.split(event))
            .scan((arr, val) => {
                arr.push(val);
                return arr;
            }, [])
            .onValue(
                (gameEvents) => vm.gameEvents = gameEvents
            );
    }
    vm.talkToAll
        .filter(_.negate(_.isUndefined))
        .log();
        // .subscribe(() => {
        //     if ($scope.sayingForm.$valid) {
        //         socket.emit('char.say', {content: vm.saying})
        //         .onValue(() => {
        //             vm.saying = '';
        //             // # temporary
        //             vm.loadEvents();
        //         });
        //     }

        // });
    // }
}
