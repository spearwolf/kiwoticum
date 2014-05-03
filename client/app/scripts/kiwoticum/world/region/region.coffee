papa.Factory "kiwoticum.world.region", ->

	initialize: (exports, self) ->

        self.centerPoint = self.world.data.centerPoints[self.id]

        self.path =
            base: self.world.data.regions[self.id].basePath
            full: self.world.data.regions[self.id].fullPath


# vim: et ts=4 sts=4 sw=4
