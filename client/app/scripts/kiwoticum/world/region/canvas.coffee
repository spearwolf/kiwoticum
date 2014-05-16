require "./region.coffee"
require "./bbox.coffee"
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
        "kiwoticum.world.region.bbox"
    ]

    initialize: (region, exports) ->

        if !!region.world.regionPathSmoothing and typeof region.world.regionPathSmoothing is 'number'
            smoothPath = (path) ->
               points = ([v.x, v.y] for v in path)
               smooth = Smooth points,
                            method: Smooth.METHOD_CUBIC
                            cubicTension: Smooth.CUBIC_TENSION_CATMULL_ROM
                            clip: Smooth.CLIP_PERIODIC
               (smooth(x) for x in [0..points.length] by region.world.regionPathSmoothing)

        else
            smoothPath = (path) -> ([v.x, v.y] for v in path)

        randColor = ->
            r = (Math.random() * (255-128))|0 +64 
            s = (Math.random() * 4)|0
            if s is 0
                return "rgb(#{r},64,64)"
            else if s is 1
                return "rgb(64,#{r},64)"
            else if s is 2
                return "rgb(64,64,#{r})"
            else if s is 3
                return "rgb(#{r},#{r},64)"


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
            ctx.fillStyle = '#ffffff'  #randColor()  #'#555555'

            if region.world.regionShapeStroke
                ctx.strokeStyle = 'rgba(0,0,0,0.5)'
                ctx.lineWidth = region.world.regionShapeStroke

            ctx.save()
            ctx.translate -region.bbox.x0, -region.bbox.y0

            drawPath smoothPath(region.path.full), !!region.world.regionShapeStroke

            ctx.lineWidth = 2
            ctx.strokeStyle = '#800030'
            drawRegionCenter ctx

            ctx.restore()


        createRegionCanvas region
        drawRegion()

        if region.world.regionPixelZoom
            pixelateCanvas region.canvas, region.world.regionPixelZoom



# vim: et ts=4 sts=4 sw=4
