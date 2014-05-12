require "./region.coffee"
require "./bbox.coffee"
require "../../canvas/create.coffee"


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
            ctx.fillStyle = '#ffffff'  #randColor()  #'#555555'

            ctx.strokeStyle = "#555555"
            if region.world.regionShapeStroke
                dpr = window.devicePixelRatio or 1
                ctx.lineWidth = region.world.regionShapeStroke * dpr

            ctx.save()
            ctx.translate -region.bbox.x0, -region.bbox.y0

            exports.drawPath region.path.full, !!region.world.regionShapeStroke

            ctx.restore()


        createRegionCanvas region
        exports.drawRegion()

        if region.world.regionPixelZoom
            pixelateCanvas region.canvas, region.world.regionPixelZoom



# vim: et ts=4 sts=4 sw=4
