angular.module('alcarin').service('Permissions', PermissionsService);

function PermissionsService(UserPermissions, PermissionsTable) {
    var service = this;
    service.UserPermissions = UserPermissions;
    service.PermissionsTable = PermissionsTable;
    UserPermissions.on('updated', function () {
        service.emit('updated');
    });
}

PermissionsService.prototype = angular.extend(new window.EventsBus(), {
    hasRaw: function permissionsServiceHasRaw(permissionCode) {
        if (angular.isUndefined(permissionCode)) {
            return false;
        }
        // public
        if (permissionCode === 1) {
            return true;
        }

        return this.UserPermissions.has(permissionCode);
    },
    has: function permissionsServiceHas(permission) {
        // ###
        // Interprete permission as string permission name, cast it to int
        // and check user has this permission.
        // ###
        permission = permission.toUpperCase();
        if (permission === 'PUBLIC') {
            return true;
        }

        if (!this.PermissionsTable) {
            return false;
        }

        // # console.log permission, PermissionsTable, UserPermissions.get()
        if (!(permission in this.PermissionsTable)) {
            return false;
        }

        var permissionCode = this.PermissionsTable[permission];
        return this.UserPermissions.has(permissionCode);
    }
});

