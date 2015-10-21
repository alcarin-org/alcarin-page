angular.module('alcarin')
    .filter('gametime', GameTimeFilter);

function GameTimeFilter() {
    var DAY_SEC = 345600; // 60 * 60 * 24 * 4
    var hour = function (timestamp) {
        return Math.floor((timestamp % DAY_SEC) / (60 * 60));
    };
    var day = function (timestamp) {
        return Math.floor(timestamp / DAY_SEC);
    };

    return function gametimeFilter(timestamp, format) {
        if (angular.isUndefined(format)) {
            format = 'long';
        }
        timestamp = timestamp || 0;
        switch (format) {
            case 'short-hour':
                return hour(timestamp) % 48;
            case 'hour':
                return hour(timestamp);
            case 'long':
                var h = hour(timestamp);
                var m = Math.floor((timestamp % (60 * 60)) / 60);
                var d = day(timestamp);
                return sprintf('Day %s, %sh %sm', d, h, m);
            case 'date':
                return day(timestamp);
            case 'night':
                return hour(timestamp) >= 24;
            default:
                return 'N/N';
        }
    };
}
