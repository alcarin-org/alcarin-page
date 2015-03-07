angular.module('alcarin').directive('needPermission', needPermissionDirective);

function needPermissionDirective ($rootScope, Permissions) {
    return {
        replace: false,
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            var refreshVisibility = function () {
                var hasPermission = Permissions.has($attrs.needPermission);
                $element.toggle(hasPermission);
            };

            $attrs.$observe('needPermission', refreshVisibility);
            Permissions.on('updated', refreshVisibility);
        }
    };
}
