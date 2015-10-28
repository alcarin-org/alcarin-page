angular.module('alcarin.game-panel')
    .factory('CharEnvironment', CharEnvironment);

function CharEnvironment(Stream, socket) {
    return {
        factory: charEnvironmentInstanceFactory
    };

    function charEnvironmentInstanceFactory(charId) {
        return socket.emit('char.activate', {
            charId: charId
        })
        .flatMap((char) => {
            return Stream.combine(
                [
                    Stream.constant(char),
                    socket.emit('loc.details')
                ],
                (char, locaction) => ({char, locaction})
            );
        });
    }
}
