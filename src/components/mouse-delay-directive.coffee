alcarin.directive 'mouseDelay', ($rootScope)->
    replace: false
    restrict: 'A'
    scope:
        mouseDelay: '&'
        delayTime: '&mouseDelayTime'
    link: ($scope, $element, $attrs)->
        over = false
        $element.on 'mouseenter', ->
            over = Promise.delay($scope.delayTime() || 500).cancellable()
            over
                .then ->
                    $scope.mouseDelay()
                    over = false
                .catch(Promise.CancellationError)

        $element.on 'mouseleave', ->
            over.cancel() if over
