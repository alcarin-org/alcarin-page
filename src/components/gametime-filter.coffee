alcarin.filter 'gametime', ->
    DAY_SEC = 345600 # 60 * 60 * 24 * 4
    hour = (timestamp)-> Math.floor((timestamp % DAY_SEC) / (60 * 60))
    day  = (timestamp)-> Math.floor(timestamp / DAY_SEC)

    (timestamp, format='long')->
        timestamp = 0 if not timestamp
        switch format
            when 'short-hour'
                return hour(timestamp) % 48
            when 'hour'
                return hour(timestamp)
            when 'long'
                h = hour(timestamp)
                m = Math.floor((timestamp % (60 * 60)) / 60)
                d = day(timestamp)
                return "Day #{d}, #{h}h #{m}m"
            when 'date'
                return day(timestamp)
            when 'night'
                return hour(timestamp) >= 24
            else
                return 'N/N'
