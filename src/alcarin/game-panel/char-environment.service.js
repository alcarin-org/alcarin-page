angular.module('alcarin.game-panel')
    .factory('CharEnvironment', CharEnvironment);

function CharEnvironment(socket) {
    return {
        factory: charEnvironmentInstanceFactory
    };

    function charEnvironmentInstanceFactory(charId) {
        return socket.emit('char.activate', {
            charId: charId
        })
        .flatMap((char) => {
            return socket.emit('loc.details')
                .map((locDetails) => ({
                    // list of environment events promises
                    char: char,
                    location: locDetails
                }));
        });
    }
}
