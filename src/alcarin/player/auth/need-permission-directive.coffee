alcarin.directive 'needPermission', ($rootScope, Permissions)->
        replace: false,
        restrict: 'A'
        link: ($scope, $element, $attrs)->
            refreshVisibility = ->
                hasPermission = Permissions.has($attrs.needPermission)
                $element.toggle(hasPermission)

            $attrs.$observe 'needPermission', refreshVisibility
            $scope.$on 'userPermissions.updated', refreshVisibility
