angular.module('alcarin').directive('mouseDelay', mouseDelayDirective);

function mouseDelayDirective() {
    return {
        replace: false,
        restrict: 'A',
        scope: {
            mouseDelay: '&',
            delayTime: '&mouseDelayTime'
        },
        link: function ($scope, $element) {
            var over = false;
            $element.on('mouseenter', function () {
                over = Promise.delay($scope.delayTime() || 500).cancellable();
                over
                .then(function () {
                    $scope.mouseDelay();
                    over = false;
                })
                .catch(Promise.CancellationError);
            });
            $element.on('mouseleave', function () {
                if (over) {
                    over.cancel();
                }
            });
        }
    };
}
