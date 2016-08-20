angular.module('alcarin.common')
    .directive('dropdown', dropdownDirective);

function dropdownDirective (Stream, $document) {
    return {
        replace: false,
        restrict: 'A',
        link: dropdownLink,
        scope: {
            isOpen: '='
        },
    };

    function dropdownLink($scope, $element) {

        var stateChanges = Stream.fromNgWatch($scope, 'isOpen')
            .skipDuplicates()
            .map((change) => change.value || false)
            .onValue(
                (val) => $element.toggleClass('dropdown-open', val)
            );

        stateChanges
            .filter()
            .flatMap(
                () => Stream.fromEvents($document, 'click')
                            .skip(1)
                            .take(1)
            )
            .onValue(
                () => $scope.$apply(() => $scope.isOpen = false)
            );
    }
}
