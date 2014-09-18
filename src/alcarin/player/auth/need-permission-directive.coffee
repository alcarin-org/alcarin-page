angular.module('alcarin')
    .directive 'needPermission', ($rootScope, Permissions)->
        replace: false,
        restrict: 'A'
        link: ($scope, $element, $attrs)->
            refreshVisibility = ->
                hasPermission = Permissions.hasPermission($attrs.needPermission)
                $element.toggle(hasPermission)

            $attrs.$observe 'needPermission', refreshVisibility
            $scope.$on 'permissions.changed', refreshVisibility
