angular.module('alcarin.auth').controller('LoginController', LoginController);

function LoginController(
    $scope, $state, $localStorage,
    socket, Permissions, logoutEnabled, Stream
) {
    var vm = this;

    _.assign(vm, {
        email: '',
        password: '',
        loginInvalid: false,

        formSubmits: Stream.emitter(),
        logout: logout,
    });

    activate();

    ///
    vm.formSubmits
        .flatMap(() =>
            socket.emit('auth.login', {
                email: vm.email,
                password: vm.password
            })
        )
        .onValue(
            (response) => {
                Permissions.set(response.permissions);
                $localStorage.apiToken = response.token;
                $state.go('home');
                vm.loginInvalid = false;
            }
        ).filterErrors(
            (err) => err.reason === 'authorization.failed'
        ).onError(
            () => vm.loginInvalid = true
        );

    function logout() {
        Permissions.set([]);
        delete $localStorage.apiToken;
        $state.go('home');
    }

    function activate() {
        logoutEnabled && logout();
    }
}
