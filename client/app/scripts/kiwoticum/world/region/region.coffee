papa.Mixin "kiwoticum.world.region", -> (region) ->

    region.centerPoint = region.world.data.centerPoints[region.id]

    region.path =
        base: region.world.data.regions[region.id].basePath
        full: region.world.data.regions[region.id].fullPath


# vim: et ts=4 sts=4 sw=4
