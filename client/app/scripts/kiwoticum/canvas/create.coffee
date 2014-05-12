require "./image_data.coffee"
require "./pixel_copy"

papa.Module "kiwoticum.canvas", (exports) ->

    exports.from = (canvas, ctx) ->
        ctx = canvas.getContext '2d' unless ctx
        papa.Mixin.NewObject "kiwoticum.canvas",
            canvas: canvas
            ctx: ctx

    exports.create = (width, height) ->
        canvas = document.createElement 'canvas'
        canvas.width = width
        canvas.height = height
        ctx = canvas.getContext '2d'
        papa.Mixin.NewObject "kiwoticum.canvas",
            canvas: canvas
            ctx: ctx


    return
# vim: et ts=4 sts=4 sw=4
