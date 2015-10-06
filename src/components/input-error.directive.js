angular
    .module('alcarin.common')
    .directive('inputError', inputErrorDirective);

function inputErrorDirective() {
    return {
        restrict: 'A',
        require: '^form',
        link: inputErrorLink
    };
}

function inputErrorLink($scope, element, attrs, formController) {
    if (!attrs.name) {
        throw new Error('input-error work only with named forms controls.');
    }

    var inputController = formController[attrs.name];

    $scope.$watch(
        () => (formController.$submitted || inputController.$touched) &&
               inputController.$invalid,
        (value) => element.toggleClass('input-error', value)
    );
}
