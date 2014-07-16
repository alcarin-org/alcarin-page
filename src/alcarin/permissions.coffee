angular.module('alcarin')
    .run ($rootScope, socket)->
        socket.forward('user.permissions')

        $rootScope.hasPermission = (permission)->
            return false if not permission?
            return permission in $rootScope.__current

        $rootScope.$on 'socket:user.permissions', (event, data)=>
            $rootScope[pName] = val for pName, val of data.all
            $rootScope.__current = data.user
