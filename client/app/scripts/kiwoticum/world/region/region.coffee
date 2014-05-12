papa.Mixin "kiwoticum.world.region", -> (region) ->

    region.centerPoint = region.world.data.centerPoints[region.id]

    region.path =
        base: region.world.data.regions[region.id].basePath
        full: region.world.data.regions[region.id].fullPath


    if region.world.regionFullPathVectorPixelator
        pixelator = region.world.regionFullPathVectorPixelator

        pointPixelator = (path) ->
            for v in path
                v.x = ((v.x / pixelator)|0) * pixelator
                v.y = ((v.y / pixelator)|0) * pixelator
            return

        pointPixelator region.path.full



# vim: et ts=4 sts=4 sw=4
