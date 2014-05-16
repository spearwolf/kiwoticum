require "./region.coffee"

papa.Mixin "kiwoticum.world.region.smooth_path", ->

    dependsOn: [
        "kiwoticum.world.region"
    ]

    initialize: (region, exports) ->

        conf = region.world.conf

        findOrCreatePath = (pathName, createPath) ->
            path_key = "smooth_#{pathName}"
            region.path[path_key] or
                    region.path[path_key] = createPath region.path[pathName]


        if conf.region.PathSmoothing and 'number' is typeof conf.region.PathSmoothing

            exports.smoothPath = (pathName) ->
                findOrCreatePath pathName, (path) ->
                    points = ([v.x, v.y] for v in path)
                    smooth = Smooth points,
                                method: Smooth.METHOD_CUBIC
                                cubicTension: Smooth.CUBIC_TENSION_CATMULL_ROM
                                clip: Smooth.CLIP_PERIODIC
                    (smooth(x) for x in [0..points.length] by conf.region.PathSmoothing)

        else

            exports.smoothPath = (pathName) ->
                findOrCreatePath pathName, (path) ->
                    ([v.x, v.y] for v in path)


# vim: et ts=4 sts=4 sw=4
