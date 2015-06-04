angular.module('alcarin')
.directive('bootstrapSubmit', bootstrapSubmitDirective);

function bootstrapSubmitDirective() {
    // ###
    // # replace ng-submit by bootstrap like version
    // # working good with 'show-errors' bootstrap
    // # form validation directive.
    // ###
    return {
        restrict: 'A',
        require: '^form',
        link: bootstrapSubmitLink
    };

    function bootstrapSubmitLink($scope, element, attrs, formController) {
        if (!element.is('form')) {
            console.warn(
               'bootstrap-submit directive must be use with \'<form>\' tags.',
                element
            );
            return;
        }
        if (element.attr('ng-submit')) {
            console.warn(
                'bootstrap-submit directive should replace \'ng-submit\' directive.',
                element
            );
            return;
        }
        element.attr('novalidate', true);
        element.on('submit', function () {
            $scope.$parent.$broadcast('show-errors-check-validity');
            if (formController.$valid) {
              $scope.$apply(function () {
                  $scope.$eval(attrs.bootstrapSubmit);
              });
            }
        });
    }
}

