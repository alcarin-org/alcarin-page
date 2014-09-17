# user can have many permissions type. by use this permissions we decide
# what api action user can do

angular.module('alcarin')
    .run ($rootScope, socket)->
        socket.forward('user.permissions')

        $rootScope.Permissions =
            PUBLIC: 1
            LOGGED: 2

        $rootScope.hasPermission = (permission)->
            return false if not permission?
            return permission in $rootScope.__user_permission

        $rootScope.$on 'socket:user.permissions', (event, data)=>
            $rootScope.__user_permission = data.permission
