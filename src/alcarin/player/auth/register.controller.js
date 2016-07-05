angular.module('alcarin.auth').controller('RegisterController', RegisterController);

function RegisterController(socket, $location, Permissions, $localStorage) {
    var vm = this;

    vm.registerUser = registerUser;

    ///

    function registerUser() {
        vm.emailOccupied = false;
        socket.emit('player.create', {
            email: vm.email,
            password: vm.password1
        })
        .onValue((response) => {
            Permissions.set(response.permissions);
            $localStorage.apiToken = response.token;
            $location.path('/');
        })
        .filterErrors(
            (err) => err.reason === 'email.occupied'
        )
        .onError(() => vm.emailOccupied = true);
    }
}
