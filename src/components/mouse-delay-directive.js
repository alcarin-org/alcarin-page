angular.module('alcarin').directive('mouseDelay', mouseDelayDirective);

function mouseDelayDirective() {
    return {
        replace: false,
        restrict: 'A',
        scope: {
            mouseDelay: '&',
            delayTime: '&mouseDelayTime'
        },
        controller: MouseDelayController,
        controllerAs: 'vm',
        link: linkMouseDelay,
        bindToController: true
    };

    function MouseDelayController() {
        var vm = this;

        vm.isMouseOver  = false;
        vm.onMouseEnter = mouseEnter;
        vm.onMouseLeave = mouseLeave;

        //////

        function mouseEnter() {
            vm.over = Promise.delay(vm.delayTime() || 500).cancellable();
            vm.over
            .then(function () {
                vm.mouseDelay();
                vm.over = false;
            })
            .catch(Promise.CancellationError);
        }
        function mouseLeave() {
            if (vm.over) {
                vm.over.cancel();
            }
        }
    }
    function linkMouseDelay($scope, element, attr, ctrl) {
        element.on('mouseenter', ctrl.onMouseEnter);
        element.on('mouseleave', ctrl.onMouseLeave);
    }
}
