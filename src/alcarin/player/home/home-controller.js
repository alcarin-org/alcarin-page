angular.module('alcarin').controller('HomeController', HomeController);

function HomeController(socket) {
    var vm = this;

    activate();
    ///

    function activate() {
        socket.emit('player.fetch-chars')
        .then(function (chars) {
            vm.chars = chars;
        });
    }

}
