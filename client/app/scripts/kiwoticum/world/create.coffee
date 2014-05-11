require "./setup.coffee"
require "./config.coffee"

papa.Module "kiwoticum.world", (exports) ->

    exports.create = (data) ->
        papa.Mixin.NewObject [
                "kiwoticum.world.config",
                "kiwoticum.world"
            ], data: data


    return
# vim: et ts=4 sts=4 sw=4
