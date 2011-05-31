jQuery(function($) {

    var $canvas = $("#noise"),
        width = $canvas.width(),
        height = $canvas.height(),
        ctx = $canvas.get(0).getContext("2d");

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, width, height);
    
    var pixel = ctx.createImageData(1, 1);
    pixel.data[3] = 255;  // a

    function rgb(r, g, b) {
        pixel.data[0] = r;
        pixel.data[1] = g;
        pixel.data[2] = b;
    }

    window.draw_pixel = function(x, y, r, g, b) {
        if (g === undefined) {
            rgb(r, r, r);
        } else {
            rgb(r, g, b);
        }
        ctx.putImageData(pixel, x, y);
    };

    var noise = new SimplexNoise(),
        x, y, n, m = 2.0;

    for (y = 0; y < height; ++y) {
        for (x = 0; x < width; ++x) {
            n = noise.noise((x/width)*m, (y/height)*m);

            if (n > -0.3) {
                draw_pixel(x, y, 0);
            }

            //draw_pixel(x, y, Math.round(n*127 + 128));

            //if (n >= 0.0) {
                //draw_pixel(x, y, Math.round(n*255));
            //} else {
                //m = Math.round(-n*255);
                //draw_pixel(x, y, 64, 128, m);
            //}
        }
    }
});
