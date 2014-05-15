require "./region.coffee"
require "./bbox.coffee"
require "./canvas.coffee"
require "./sprite_pixi.coffee"

papa.Module "kiwoticum.world.region", (exports) ->

    exports.create = (world, id) ->
        papa.Mixin.NewObject [
                'kiwoticum.world.region',
                'kiwoticum.world.region.bbox',
                'kiwoticum.world.region.canvas',
                'kiwoticum.world.region.sprite_pixi'
            ],
            world: world
            id: id


    return
# vim: et ts=4 sts=4 sw=4
