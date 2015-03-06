angular.module('alcarin').service 'Permissions',

class Permissions extends EventsBus
    constructor: (@UserPermissions, @PermissionsTable)->
        @UserPermissions.on 'updated', => @emit('updated')
        super()

    hasRaw: (permissionCode)->
        return true if permission is 1 # public
        return false if not permission?
        return permissionCode in @UserPermissions.get()

    has: (permission)->
        ###
        Interprete permission as string permission name, cast it to int
        and check user has this permission.
        ###
        permission = permission.toUpperCase()
        return true if permission is 'PUBLIC'
        return false if not @PermissionsTable?

        # console.log permission, PermissionsTable, UserPermissions.get()
        return false if permission not of @PermissionsTable
        permissionCode = @PermissionsTable[permission]
        return permissionCode in @UserPermissions.get()


