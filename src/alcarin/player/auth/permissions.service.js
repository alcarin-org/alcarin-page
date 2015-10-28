angular.module('alcarin.auth')
    .factory('Permissions', PermissionsFactory);

function PermissionsFactory(UserPermissions, PermissionsTable) {
    var Permissions = _.create(window.EventsBus, {
        UserPermissions : UserPermissions,
        PermissionsTable: PermissionsTable,
        hasRaw: permissionsServiceHasRaw,
        has: permissionsServiceHas,
    });

    UserPermissions.on('updated', () => Permissions.emit('updated'));
    return Permissions;

    function permissionsServiceHasRaw(permissionCode) {
        if (_.isUndefined(permissionCode)) {
            return false;
        }
        // public
        if (permissionCode === 1) {
            return true;
        }

        return this.UserPermissions.has(permissionCode);
    }
    function permissionsServiceHas(permission) {
        // ###
        // Interprete permission as string permission name, cast it to int
        // and check user has this permission.
        // ###
        permission = permission.toUpperCase();
        if (permission === 'PUBLIC') {
            return true;
        }

        // # console.log permission, PermissionsTable, UserPermissions.get()
        if (!(this.PermissionsTable &&
             (permission in this.PermissionsTable))
        ) {
            return false;
        }

        var permissionCode = this.PermissionsTable[permission];
        return this.UserPermissions.has(permissionCode);
    }
}
