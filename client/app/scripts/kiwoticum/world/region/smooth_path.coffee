require "./region.coffee"

papa.Mixin "kiwoticum.world.region.smooth_path", ->

    namespace: 'smoothPath'

    dependsOn: [
        "kiwoticum.world.region"
    ]

    initialize: (region, exports) ->

        world = region.world
        smoothPathCache = {}

        if !!world.regionPathSmoothing and typeof world.regionPathSmoothing is 'number'

            exports.get = (pathName) ->
                return smoothPathCache[pathName] if smoothPathCache[pathName]

                path = region.path[pathName]
                points = ([v.x, v.y] for v in path)
                smooth = Smooth points,
                            method: Smooth.METHOD_CUBIC
                            cubicTension: Smooth.CUBIC_TENSION_CATMULL_ROM
                            clip: Smooth.CLIP_PERIODIC

                smoothPathCache[pathName] = (smooth(x) for x in [0..points.length] by world.regionPathSmoothing)

        else

            exports.get = (path) ->
                smoothPathCache[pathName] or
                    smoothPathCache[pathName] = ([v.x, v.y] for v in path)


# vim: et ts=4 sts=4 sw=4
