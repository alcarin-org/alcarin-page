angular
    .module('alcarin.common')
    .factory('Stream', kefirStreamProvider);

function kefirStreamProvider() {
    Kefir.emitter = kefirEmitterFactory;
    var streamProto = Kefir.Observable.prototype;
    streamProto.onError = onStreamErrorFn(streamProto.onError);
    return Kefir;
}
function kefirEmitterFactory() {
    var stream = Kefir.stream((emitter) => {
        ['emit', 'error', 'end'].forEach(
            (key) => {
                stream[key] = (val) => {
                    emitter[key](val);
                    return stream;
                };
            }
        );
    });
    return stream;
}

function onStreamErrorFn(baseOnError) {
    return function onStreamError(type, errHandler) {
        // override blubird default 'catch' method to support error reason catch filtering.
        // stream
        //  .onValue(...)
        //  .onError('validation.failed', (err)-> console.log('validate problem'))
        //  .onError( (err)-> console.log('other problem'))
        if (typeof type === 'string') {
            return baseOnError.call(this, (err) => {
                if (err.reason === type) {
                    errHandler(err);
                }
            });
        } else {
            errHandler = type;
            return baseOnError.call(this, errHandler);
        }
    };
}
// -    Promise.setScheduler(function (cb) {
// -        return $rootScope.$evalAsync(cb);
// -    });
