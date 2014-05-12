papa.Mixin "kiwoticum.app.world_viewer", ->

    dependsOn: "events"

    initialize: (app, exports) ->

        exports.setWorld = (world) -> app.world = world

        #app.on 'idle', ->

        #app.on 'resize', (w, h) ->

        app.on 'render', (ctx) ->
            ctx.save()
            ctx.setTransform 1, 0, 0, 1, 0, 0
            ctx.clearRect 0, 0, app.width, app.height
            ctx.restore()

            unless app.world
                ctx.fillStyle = '#666666'
                ctx.fillRect 0, 0, app.width/2, app.height

            if app.world
                region = app.world.regions[0]

                ctx.fillStyle = '#204060'
                ctx.fillRect 0, 0, region.bbox.w, region.bbox.h
                ctx.drawImage region.canvas, 0, 0


# vim: et ts=4 sts=4 sw=4
