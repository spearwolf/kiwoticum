require "./region/create.coffee"

papa.Mixin "kiwoticum.world", -> (world) ->

    createRegion = (id) -> kiwoticum.world.region.create world, id

    world.regions = (createRegion id for id in [0...world.data.regions.length])


# vim: et ts=4 sts=4 sw=4
