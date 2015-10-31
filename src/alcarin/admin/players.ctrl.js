angular.module('alcarin.admin')
    .controller('PlayersController', PlayersController);

function PlayersController(
    $scope, Stream, socket, PermissionsTable
) {
    var vm = this;
    _.assign(vm, {
        PermissionsList: PermissionsTable,
        permissionToggling: Stream.emitter(),
        filter: {},
        filterChanges: Stream.emitter(),
        playerChoices: Stream.emitter(),
        permissionsSelection: {},
    });

    vm.filterChanges
        .filter((val) => !!val.email)
        .debounce(400)
        .flatMap(
            (filter) => socket.emit('admin.players', filter)
        )
        .onValue(
            (players) => vm.players = players
        );

    vm.permissionToggling
        .onValue(togglePermission)
        .debounce(400)
        .map(
            () => _.pick(vm.selectedPlayer, ['_id', 'permissions'])
        )
        .onValue(
            (data) => socket.emit('admin.update-permissions', data)
        );

    function togglePermission(perm) {
        var permissions = _.without(
            vm.selectedPlayer.permissions,
            perm
        );
        if (permissions.length === vm.selectedPlayer.permissions.length) {
            permissions.push(perm);
        }
        vm.selectedPlayer.permissions = permissions;
    }
}
