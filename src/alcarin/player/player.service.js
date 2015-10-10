angular.module('alcarin.auth')
    .factory('Player', PlayerService);

function PlayerService(socket) {

    return {
        createCharacter: createCharacter,
        fetchPlayableRaces: fetchPlayableRaces,
    };

    function createCharacter(characterData) {
        return socket.emit(
            'player.create-char', characterData
        );
    }

    function fetchPlayableRaces() {
        return socket.emit('game.playable-races');
    }
}
