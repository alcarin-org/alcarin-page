"use strict"

# this file should export all needed project front-end js dependencies.
# grunt build will paste dependencies from npm there.
main = ->
    require 'angular'
    require 'angular-bootstrap'
    require 'angular-route'
    window.Promise = require 'bluebird'

    $('html').removeClass('no-js').addClass('js')

    angular.module('alcarin', ['ngRoute'])
        .config ($routeProvider, $locationProvider)->
            $routeProvider.
            when('/login', {
                templateUrl: '/static/alcarin/player/auth/login.html',
                controller: 'LoginController'
            }).
            otherwise
                redirectTo: '/login'

            $locationProvider.html5Mode(true)
main()
