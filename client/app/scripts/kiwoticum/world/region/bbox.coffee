require "./region.coffee"


findMin = (key, path) ->
    min = null
    for v in path
        min = v[key] if min is null or v[key] < min
    return min

findMax = (key, path) ->
    max = null
    for v in path
        max = v[key] if max is null or v[key] > max
    return max


papa.Mixin "kiwoticum.world.region.bbox", ->

    dependsOn: "kiwoticum.world.region"

    initialize: (region) ->

        conf = region.world.conf

        region.bbox =
            x0: findMin('x', region.path.full) - conf.region.PaddingX
            y0: findMin('y', region.path.full) - conf.region.PaddingY
            x1: findMax('x', region.path.full) + conf.region.PaddingX
            y1: findMax('y', region.path.full) + conf.region.PaddingY

        region.bbox.w = region.bbox.x1 - region.bbox.x0
        region.bbox.h = region.bbox.y1 - region.bbox.y0


# vim: et ts=4 sts=4 sw=4
