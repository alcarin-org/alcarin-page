angular.module('alcarin').controller('CreateCharController', CreateCharController);

function CreateCharController(socket, $state) {
    var vm = this;
    vm.char = {};

    vm.createChar = createChar;

    ///

    function createChar() {
        socket.emit('player.create-char', vm.char)
        .then(function () {
            $state.go('home');
        });
    }
}
