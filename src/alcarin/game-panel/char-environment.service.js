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
        .then((char) => Promise.props({
            // list of environment events promises
            char: char,
            location: socket.emit('loc.details')
        }));
    }
}
