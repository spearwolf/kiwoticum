require "./region.coffee"
require "./bbox.coffee"

papa.Module "kiwoticum.world.region", window, (exports) ->

    exports.create = (world, id) ->
        papa.Factory.Create [
                'kiwoticum.world.region',
                'kiwoticum.world.region.bbox'
            ], yes,
                world: world
                id: id



    return
# vim: et ts=4 sts=4 sw=4
