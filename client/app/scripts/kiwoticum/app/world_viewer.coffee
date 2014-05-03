papa.Factory "kiwoticum.app.world_viewer", ->

    dependsOn: "events"

    initialize: (exports, self) ->

        self.on 'resize', (w, h) ->
            self.width = w
            self.height = h
            # console.log 'resize', w, h

        self.on 'render', (ctx) ->
            ctx.save()
            ctx.setTransform 1, 0, 0, 1, 0, 0
            ctx.clearRect 0, 0, ctx.width, ctx.height
            ctx.restore()

            ctx.fillStyle = '#666666'
            ctx.fillRect 0, 0, self.width/2, self.height


# vim: et ts=4 sts=4 sw=4
