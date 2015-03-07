// # just tell the world that JS is enabled - by class.
$('html').removeClass('no-js').addClass('js');

// ###
// this file is always compiling first.
// ###

angular.module('alcarin', [
    // # angularjs state routing extension
    'ui.router',
    // # socket.io cooperating with angularjs
    'btford.socket-io',
    // # showErrors - bootstrap forms validation way with angularjs
    'ui.bootstrap.showErrors',
    'ui.bootstrap.tpls',
    'ui.bootstrap.tooltip',
    'ngStorage',

    'mgo-angular-wizard'
]);
