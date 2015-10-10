angular.module('alcarin').controller('CreateCharController', CreateCharController);

function CreateCharController($state, socket, Character) {
    var vm = this;

    _.assign(vm, {
        char: {},
        createChar: createChar,
    });
    vm.char = {};

    vm.createChar = createChar;

    activate();

    function activate() {
        vm.isLoading = true;
        Character.fetchPlayableRaces().then(
            (races) => {
                vm.char.race = _.first(races).id;
                vm.playableRaces = races;
                vm.isLoading = false;
            }
        );
    }
    function createChar() {
        socket.emit(
            'player.create-char', vm.char
        ).then(() => $state.go('home'));
    }
}
