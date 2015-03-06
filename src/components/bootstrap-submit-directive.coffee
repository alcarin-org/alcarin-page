angular.module('alcarin').directive 'bootstrapSubmit', ->
    ###
    # replace ng-submit by bootstrap like version working good with 'show-errors' bootstrap
    # form validation directive.
    ###
    restrict: 'A'
    require: '^form'
    link: ($scope, element, attrs, formController)->
      if not element.is('form')
        console.warn 'bootstrap-submit directive must be use with \'<form>\' tags.', element
        return
      if element.attr('ng-submit')
        console.warn 'bootstrap-submit directive should replace \'ng-submit\' directive.', element
        return
      element.attr('novalidate', true)
      element.on 'submit', (e)->
        $scope.$parent.$broadcast('show-errors-check-validity')
        if formController.$valid
          $scope.$apply -> $scope.$eval(attrs.bootstrapSubmit)

