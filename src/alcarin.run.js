angular.module('alcarin')
    .run(OnAlcarinRun);

const GameTimeFetchInterval = 60 * 1000;

function OnAlcarinRun($rootScope, Stream, socket) {
    var intervalStream = Stream.interval(GameTimeFetchInterval);
    Stream.merge([intervalStream, Stream.constant()])
        .flatMap(
            () => socket.emit('game.gametime')
        )
        .onValue(
            (gt) => $rootScope.gametime = gt.timestamp
        );
}
