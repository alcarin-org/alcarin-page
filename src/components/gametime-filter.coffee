alcarin.filter 'gametime', ->
    DAY_SEC = 345600 # 60 * 60 * 24 * 4

    (timestamp)->
        hours = Math.floor((timestamp % DAY_SEC) / (60 * 60))
        return  "#{hours}h"
