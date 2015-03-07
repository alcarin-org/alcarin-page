angular.module('alcarin').controller('LoginController', LoginController);

function LoginController(
    $scope, $state, socket, UserPermissions, logout, $localStorage
) {
    var vm = this;

    vm.email        = '';
    vm.password     = '';
    vm.loginInvalid = false;

    vm.login = function () {
        socket.emit('auth.login', {
            email: vm.email,
            password: vm.password
        }).then(function (response) {
            UserPermissions.set(response.permissions);
            $localStorage.apiToken = response.token;
            $state.go('home');
            vm.loginInvalid = false;
        }).catch('authorization.failed', function () {
            console.log('aca');
            vm.loginInvalid = true;
        });
    };

    vm.logout = function () {
        UserPermissions.set([]);
        delete $localStorage.apiToken;
        $state.go('home');
    };

    logout && logout();
}
