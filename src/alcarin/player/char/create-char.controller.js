angular.module('alcarin').controller('CreateCharController', CreateCharController);

function CreateCharController($state, socket, Player) {
    var vm = this;

    _.assign(vm, {
        step: 'Race',
        char: {
        },
        createChar: createChar,
        selectedRaceGenders: selectedRaceGenders,
    });

    activate();

    function activate() {
        vm.isLoading = true;
        Player.fetchPlayableRaces().then(
            (races) => {
                var race         = _.first(races);
                vm.char.race     = race.id;
                vm.char.gender   = race.possibleGenders[0];
                vm.playableRaces = races;
                vm.isLoading     = false;
            }
        );
    }

    function selectedRaceGenders() {
        if (!vm.char.race) {
            return;
        }
        var race = _.find(vm.playableRaces, {id: vm.char.race});
        return race.possibleGenders;
    }

    function createChar() {
        Player.createChar(vm.char).then(
            () => $state.go('home')
        );
    }
}
