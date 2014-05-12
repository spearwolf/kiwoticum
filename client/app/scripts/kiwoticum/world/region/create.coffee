require "./region.coffee"
require "./bbox.coffee"
require "./pixi_sprite.coffee"

papa.Module "kiwoticum.world.region", (exports) ->

    exports.create = (world, id) ->
        papa.Mixin.NewObject [
                'kiwoticum.world.region',
                'kiwoticum.world.region.bbox',
                'kiwoticum.world.region.region_canvas',
                'kiwoticum.world.region.pixi_sprite'
            ],
            world: world
            id: id


    return
# vim: et ts=4 sts=4 sw=4
