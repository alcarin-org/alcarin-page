angular.module('alcarin').controller('CreateCharController', CreateCharController);

function CreateCharController(socket, $state) {
    var vm = this;
    vm.char = {};

    vm.createChar = function () {
        vm.socket.emit('player.create-char', vm.char).then(function () {
            $state.go('home');
        });
    };
}
