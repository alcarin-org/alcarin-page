angular.module('alcarin')
    .factory 'Permissions', (socket)->
        return {
            registerPermissionsList: (list)->
                @permissionsList = list

            registerUserPermissions: (userPermissions)->
                @userPermissions = userPermissions

            hasRawPermission: (permissionCode)->
                return true if permission is 1 # public
                return false if not permission?
                return permissionCode in @userPermissions

            hasPermission: (permission)->
                ###
                Interprete permission as string permission name, cast it to int
                and check user has this permission.
                ###
                permission = permission.toUpperCase()
                return true if permission is 'PUBLIC'
                return false if not @permissionsList?

                return false if permission not of @permissionsList
                permissionCode = @permissionsList[permission]
                return permissionCode in @userPermissions
        }
    .run ($rootScope, socket, Permissions)->
        socket.forward('user.permissions')
        $rootScope.$on 'socket:user.permissions', (event, data)=>
            Permissions.registerPermissionsList(data.all)
            Permissions.registerUserPermissions(data.user)
            $rootScope.$broadcast('permissions.changed')

