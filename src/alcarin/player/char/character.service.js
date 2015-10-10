angular.module('alcarin.auth')
    .factory('Character', CharacterService);

function CharacterService(socket) {

    return {
        fetchPlayableRaces: fetchAvailableRaces,
    };

    function fetchAvailableRaces() {
        return socket.emit('game.playable-races');
    }
}
