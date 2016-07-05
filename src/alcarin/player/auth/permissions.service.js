angular.module('alcarin.auth')
    .factory('Permissions', PermissionsFactory);

function PermissionsFactory(InitUserPermissions, PermissionsDefTable) {
    var Permissions = _.create(window.EventsBus, {
        PermissionsDefTable: PermissionsDefTable,
        hasRaw: permissionsServiceHasRaw,
        has: permissionsServiceHas,
        set(permissions) {
            this.__permissions = permissions;
            this.emit('updated');
        }
    });
    Permissions.set(InitUserPermissions);

    return Permissions;

    function permissionsServiceHasRaw(permissionCode) {
        if (_.isUndefined(permissionCode)) {
            return false;
        }
        // public
        if (permissionCode === 1) {
            return true;
        }

        return (this.__permissions & permissionCode) === permissionCode;
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

        if (!(permission in this.PermissionsDefTable)) {
            return false;
        }

        var permissionCode = this.PermissionsDefTable[permission];
        return this.hasRaw(permissionCode);
    }
}
