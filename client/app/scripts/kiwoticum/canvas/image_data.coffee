papa.Mixin "kiwoticum.canvas", -> (canvas, exports) ->

    exports.imageData = (pixelData) ->
        if pixelData
            canvas.ctx.putImageData pixelData, 0, 0
        else
            canvas.ctx.getImageData 0, 0, canvas.canvas.width, canvas.canvas.height



# vim: et ts=4 sts=4 sw=4
