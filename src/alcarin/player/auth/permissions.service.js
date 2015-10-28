angular.module('alcarin.auth')
    .factory('Permissions', PermissionsFactory);

function PermissionsFactory(InitUserPermissions, PermissionsTable) {
    var Permissions = _.create(window.EventsBus, {
        __permissions : InitUserPermissions,
        PermissionsTable: PermissionsTable,
        hasRaw: permissionsServiceHasRaw,
        has: permissionsServiceHas,
        set(permissions) {
            this.__permissions = permissions;
            this.emit('updated');
        }
    });

    return Permissions;

    function permissionsServiceHasRaw(permissionCode) {
        if (_.isUndefined(permissionCode)) {
            return false;
        }
        // public
        if (permissionCode === 1) {
            return true;
        }

        return _.contains(this.__permissions, permissionCode);
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

        if (!(this.PermissionsTable &&
             (permission in this.PermissionsTable))
        ) {
            return false;
        }

        var permissionCode = this.PermissionsTable[permission];
        return _.contains(this.__permissions, permissionCode);
    }
}
