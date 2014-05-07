papa.Factory "kiwoticum.app.world_viewer", ->

    dependsOn: "events"

    initialize: (exports, app) ->

        exports.setWorld = (world) -> app.world = world

        app.on 'render', (ctx) ->
            ctx.save()
            ctx.setTransform 1, 0, 0, 1, 0, 0
            ctx.clearRect 0, 0, app.width, app.height
            ctx.restore()

            ctx.fillStyle = '#666666'
            ctx.fillRect 0, 0, app.width/2, app.height


# vim: et ts=4 sts=4 sw=4
