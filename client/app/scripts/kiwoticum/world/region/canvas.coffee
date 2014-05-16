require "./region.coffee"
require "./bbox.coffee"
require "./smooth_path.coffee"
require "../../canvas/create.coffee"


createRegionCanvas = (region) ->
    region.canvas = document.createElement 'canvas'
    region.canvas.width = region.bbox.w
    region.canvas.height = region.bbox.h
    region.ctx = region.canvas.getContext '2d'


papa.Mixin "kiwoticum.world.region.canvas", ->

    dependsOn: [
        "kiwoticum.world.region",
        "kiwoticum.world.region.bbox",
        "kiwoticum.world.region.smooth_path"
    ]

    initialize: (region, exports) ->

        conf = region.world.conf


        drawPath = (ctx, path, stroke = no) ->
            ctx.beginPath()
            ctx.moveTo path[0][0], path[0][1]

            for i in [1...path.length]
                ctx.lineTo path[i][0], path[i][1]

            ctx.closePath()
            ctx.fill()
            ctx.stroke() if stroke
            return


        drawRegionCenter = (ctx) ->
            ctx.beginPath()
            ctx.arc region.centerPoint.x, region.centerPoint.y, region.centerPoint.iR, 0, 2 * Math.PI, false
            ctx.closePath()
            ctx.stroke()
            return


        drawRegion = (ctx) ->
            ctx.clearRect 0, 0, region.canvas.width, region.canvas.height

            ctx.fillStyle = conf.region.ShapeFillStyle

            if conf.region.ShapeStroke
                ctx.strokeStyle = conf.region.ShapeStrokeStyle
                ctx.lineWidth = conf.region.ShapeStroke

            ctx.save()
            ctx.translate -region.bbox.x0, -region.bbox.y0

            drawPath ctx, region.smoothPath("full"), conf.region.ShapeStroke

            if conf.region.CenterLineWidth
                ctx.lineWidth = conf.region.CenterLineWidth
                ctx.strokeStyle = conf.region.CenterStrokeStyle
                drawRegionCenter ctx

            ctx.restore()


        drawRegion createRegionCanvas(region)

        if conf.region.PixelZoom
            kiwoticum.canvas.from(region.canvas).pixelateCanvas conf.region.PixelZoom



# vim: et ts=4 sts=4 sw=4
