angular.module('alcarin.auth').controller('LoginController', LoginController);

function LoginController(
    $scope, $state, socket, UserPermissions, logout, $localStorage
) {
    var vm = this;

    vm.email        = '';
    vm.password     = '';
    vm.loginInvalid = false;

    vm.login = login;
    vm.logout = logout;

    activate();

    ///

    function login() {
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
    }

    function logout() {
        UserPermissions.set([]);
        delete $localStorage.apiToken;
        $state.go('home');
    }

    function activate() {
        logout && logout();
    }
}
