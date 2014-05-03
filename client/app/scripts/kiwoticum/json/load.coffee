papa.Module "kiwoticum.json", window, (exports) ->

    exports.load = (url) ->
        deferred = Q.defer()

        req = new XMLHttpRequest()
        req.open 'GET', url, true

        req.onload = ->
            if req.status >= 200 and req.status < 400
                deferred.resolve JSON.parse(req.responseText)
            else
                console.log 'ERROR', req

        req.onerror = -> console.log 'ERROR', req

        req.send()
        deferred.promise

    return
# vim: et ts=4 sts=4 sw=4
