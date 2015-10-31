// just tell the world that JS is enabled - by class.
$('html').removeClass('no-js').addClass('js');

angular.module('alcarin', [
    'stack-trace-sourcemaps',
    // angularjs state routing extension
    'ui.router',
    // socket.io cooperating with angularjs
    'ngStorage',
    'mgo-angular-wizard',

    'alcarin-html-templates',
    'alcarin.game-panel',
    'alcarin.auth',
    'alcarin.admin',
]);
