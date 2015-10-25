angular.module('alcarin').controller('HomeController', HomeController);

function HomeController(socket) {
    var vm = this;

    activate();

    function activate() {
        socket.emit('player.fetch-chars')
              .onValue((chars) => vm.chars = chars);
    }
}
