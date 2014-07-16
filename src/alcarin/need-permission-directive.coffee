angular.module('alcarin')
    .directive 'needPermission', ($rootScope)->
        replace: false,
        restrict: 'A',
        scope:
            permission: '&needPermission',
        link: ($scope, $element, $attrs)->
            $scope.$watch 'permission()', (perm)->
                hasPermission = $rootScope.hasPermission(perm)
                $element.toggle(hasPermission)
