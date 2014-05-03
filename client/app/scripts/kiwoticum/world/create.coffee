require "./setup.coffee"

papa.Module "kiwoticum.world", window, (exports) ->

    exports.create = (data) ->
        papa.Factory.Create "kiwoticum.world", true, data: data


    return
# vim: et ts=4 sts=4 sw=4
