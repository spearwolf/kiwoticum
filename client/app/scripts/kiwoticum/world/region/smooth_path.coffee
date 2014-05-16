require "./region.coffee"

papa.Mixin "kiwoticum.world.region.smooth_path", ->

    dependsOn: [
        "kiwoticum.world.region"
    ]

    initialize: (region, exports) ->

        conf = region.world.conf

        getPathKey = (name) -> "smooth_#{name}"

        if conf.region.PathSmoothing and 'number' is typeof conf.region.PathSmoothing

            exports.smoothPath = (pathName) ->
                path_key = getPathKey(pathName)
                return region.path[path_key] if region.path[path_key]

                path = region.path[pathName]
                points = ([v.x, v.y] for v in path)
                smooth = Smooth points,
                            method: Smooth.METHOD_CUBIC
                            cubicTension: Smooth.CUBIC_TENSION_CATMULL_ROM
                            clip: Smooth.CLIP_PERIODIC

                region.path[path_key] = (smooth(x) for x in [0..points.length] by conf.region.PathSmoothing)

        else

            exports.smoothPath = (path) ->
                path_key = getPathKey(pathName)
                region.path[path_key] or
                    region.path[path_key] = ([v.x, v.y] for v in path)


# vim: et ts=4 sts=4 sw=4
