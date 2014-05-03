require "./region/create.coffee"

papa.Factory "kiwoticum.world", ->

    initialize: (exports, self) ->

        createRegion = (id) ->
            kiwoticum.world.region.create self, id

        self.regions = (createRegion(i) for i in [0...self.data.regions.length])


# vim: et ts=4 sts=4 sw=4
