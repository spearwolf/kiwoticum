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


papa.Factory "kiwoticum.world.region.bbox", ->

    dependsOn: "kiwoticum.world.region"
    initialize: (exports, self) ->

        self.bbox =
            x0: findMin 'x', self.path.full
            y0: findMin 'y', self.path.full
            x1: findMax 'x', self.path.full
            y1: findMax 'y', self.path.full
        
        self.bbox.w = self.bbox.x1 - self.bbox.x0
        self.bbox.h = self.bbox.y1 - self.bbox.y0


# vim: et ts=4 sts=4 sw=4
