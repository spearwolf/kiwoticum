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

    namespace: 'canvas'

    dependsOn: [
        "kiwoticum.world.region",
        "kiwoticum.world.region.bbox",
        "kiwoticum.world.region.smooth_path"
    ]

    initialize: (region, exports) ->

        world = region.world


        pixelateCanvas = (canvas, pixelate) ->
            kiwoticum.canvas.from(canvas).pixelateCanvas pixelate


        drawPath = (path, stroke = no) ->
            ctx = region.ctx

            ctx.beginPath()
            ctx.moveTo path[0][0], path[0][1]

            for i in [1...path.length]
                ctx.lineTo path[i][0], path[i][1]

            ctx.closePath()
            ctx.fill()
            ctx.stroke() if stroke


        drawRegionCenter = (ctx) ->
            ctx.beginPath()
            ctx.arc region.centerPoint.x, region.centerPoint.y, region.centerPoint.iR, 0, 2 * Math.PI, false
            ctx.closePath()
            ctx.stroke()


        drawRegion = ->
            ctx = region.ctx
            ctx.clearRect 0, 0, region.canvas.width, region.canvas.height

            ctx.fillStyle = world.regionShapeFillStyle

            if world.regionShapeStroke
                ctx.strokeStyle = world.regionShapeStrokeStyle
                ctx.lineWidth = world.regionShapeStroke

            ctx.save()
            ctx.translate -region.bbox.x0, -region.bbox.y0

            drawPath region.smoothPath.get("full"), !!world.regionShapeStroke

            if world.regionCenterLineWidth
                ctx.lineWidth = world.regionCenterLineWidth
                ctx.strokeStyle = world.regionCenterStrokeStyle
                drawRegionCenter ctx

            ctx.restore()


        createRegionCanvas region
        drawRegion()

        if world.regionPixelZoom
            pixelateCanvas region.canvas, world.regionPixelZoom



# vim: et ts=4 sts=4 sw=4
