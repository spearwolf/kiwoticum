(function(){

    function pixelCopy(source, sw, sh, target, w, h) {

        var sourcePixel = source.imageData()
          , pixel = target.imageData()
          //, w = target.width
          //, h = target.height
          //, sw = source.width
          , swFactor = sw / w
          //, shFactor = source.height / h
          , shFactor = sh / h
          , x, y, sx, sy
          , si, pi
          ;

        for (y = 0; y < h; y++)
            for (x = 0; x < w; x++) {
                sx = (swFactor * x)|0;
                sy = (shFactor * y)|0;
                si = ((sy * sw) + sx) << 2;
                pi = ((y * w) + x) << 2;

                pixel.data[pi] = sourcePixel.data[si];
                pixel.data[pi+1] = sourcePixel.data[si+1];
                pixel.data[pi+2] = sourcePixel.data[si+2];
                pixel.data[pi+3] = sourcePixel.data[si+3];
            }

        target.imageData(pixel);
    }


    papa.Mixin("kiwoticum.canvas", function() {
        return function(canvas, exports) {

            exports.pixelCopy = function(target) {
                if (!target.papa) {
                    target = kiwoticum.canvas.createFrom(target);
                }
                pixelCopy(canvas,
                    canvas.canvas.width,
                    canvas.canvas.height,
                    target,
                    target.canvas.width,
                    target.canvas.height);
            };

            exports.pixelateCanvas = function(pixelZoom) {
                var dpr = window.devicePixelRatio || 1
                  , pz = pixelZoom * dpr
                  , w = (canvas.canvas.width / pz)|0
                  , h = (canvas.canvas.height / pz)|0
                  , tmp = kiwoticum.canvas.create(w, h)
                  ;
                tmp.ctx.drawImage(canvas.canvas, 0, 0, w, h);
                tmp.pixelCopy(canvas);
            };

        };
    });
})();
