require "./region.coffee"
require "./bbox.coffee"


createRegionCanvas = (region) ->
    region.canvas = document.createElement 'canvas'
    region.canvas.width = region.bbox.w
    region.canvas.height = region.bbox.h
    region.ctx = region.canvas.getContext '2d'


papa.Mixin "kiwoticum.world.region.region_canvas", ->

    namespace: 'canvas'

    dependsOn: [
        "kiwoticum.world.region",
        "kiwoticum.world.region.bbox"
    ]

    initialize: (region, exports) ->

        exports.drawPath = (path, stroke = no) ->
            ctx = region.ctx

            ctx.beginPath()
            ctx.moveTo path[0].x, path[0].y

            for i in [1...path.length]
                ctx.lineTo path[i].x, path[i].y

            ctx.closePath()
            ctx.fill()
            ctx.stroke() if stroke


        exports.drawRegion = ->
            ctx = region.ctx

            ctx.clearRect 0, 0, region.canvas.width, region.canvas.height
            ctx.strokeStyle = "#000000"
            ctx.fillStyle = '#555555'
            ctx.lineWidth = window.devicePixelRatio or 1

            ctx.save()
            ctx.translate -region.bbox.x0, -region.bbox.y0

            exports.drawPath region.path.full, yes

            ctx.restore()


        createRegionCanvas region
        exports.drawRegion()

# vim: et ts=4 sts=4 sw=4
