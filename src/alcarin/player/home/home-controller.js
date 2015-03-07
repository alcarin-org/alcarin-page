angular.module('alcarin').controller('HomeController', HomeController);

function HomeController(socket) {
    var vm = this;

    socket.emit('player.fetch-chars').then(function (chars) {
        vm.chars = chars;
    });
}
