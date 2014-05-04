require "./region/create.coffee"

papa.Factory "kiwoticum.world", -> (exports, world) ->

    createRegion = (id) ->
        kiwoticum.world.region.create world, id

    world.regions = (createRegion(i) for i in [0...world.data.regions.length])


# vim: et ts=4 sts=4 sw=4
