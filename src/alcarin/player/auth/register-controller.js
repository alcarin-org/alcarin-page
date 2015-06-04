angular.module('alcarin.auth').controller('RegisterController', RegisterController);

function RegisterController(socket, $location, UserPermissions, $localStorage) {
    var vm = this;

    vm.registerUser = registerUser;

    ///

    function registerUser() {
        vm.emailOccupied = false;
        socket.emit('player.create', {
            email: vm.email,
            password: vm.password1
        })
        .then(function (response) {
            UserPermissions.set(response.permissions);
            $localStorage.apiToken = response.token;
            $location.path('/');
        })
        .catch('email.occupied', function () {
            vm.emailOccupied = true;
        });
    }
}
