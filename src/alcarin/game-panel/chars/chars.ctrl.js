angular.module('alcarin.game-panel')
    .controller('CharsController', CharsController);

function CharsController(
    $scope, socket
) {
    activate();

    function activate() {
        socket.emit('char.environment')
            .then((x) =>
                console.log(x)
            );
    }
}
