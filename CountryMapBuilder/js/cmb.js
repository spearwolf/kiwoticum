
function deg2rad(angle) {
    return angle * (Math.PI / 180.0);
}

function createHexagonCoords(width, height) {
    var mx = width/2.0, my = height/2.0,
        lx = mx - 1, ly = my -1,
        START_WITH_ANGLE = 90;

    return _.map([0, 1, 2, 3, 4, 5], function(n) {
        var r = deg2rad(n*(360/6) + START_WITH_ANGLE);
        return [Math.round(Math.sin(r) * lx + mx), Math.round(Math.cos(r) * ly + my)];
    });
}

function createSvgPath(coords) {
    return _.reduce(coords, function(path, v) {
        return path + (path === "" ? "M" : " L") + (Math.round(v[0]*100)/100) + " " + (Math.round(v[1]*100)/100);
    }, "") + " z";
}

function drawGround(width, height) {
    var sizeX = 20, sizeY = 20,
        paddingX = 4, paddingY = 4,
        hexagonNumbers = createHexagonCoords(sizeX, sizeY),
        hexagonPath = createSvgPath(hexagonNumbers),
        stepX = hexagonNumbers[5][0] - hexagonNumbers[3][0],
        stepY = hexagonNumbers[5][1] - hexagonNumbers[1][1],
        stepY1 = hexagonNumbers[0][1] - hexagonNumbers[1][1],
        paper = Raphael(10, 50, width*(stepX+1)+(paddingX*width), height*stepY+stepY1+(paddingY*height)),
        y, x, hexagon, pixelX, pixelY;

    console.log("stepX", stepX, "stepY", stepY, "stepY1", stepY1);

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            hexagon = paper.path(hexagonPath);
            hexagon.attr("fill", "#79b");
            hexagon.attr("stroke", "#000");

            pixelX = x * stepX + x * paddingX;
            pixelY = y * stepY + y * paddingY;
            if (x % 2 === 1) {
                pixelY += stepY1;
            }
            hexagon.translate(pixelX, pixelY);
        }
    }
}

jQuery(function($) {

    $("#startup form").bind("submit", function(event) {
        event.preventDefault();
        $(this).hide();
        drawGround(parseInt($(this.countryMapWidth).val(), 10), parseInt($(this.countryMapHeight).val(), 10));

        console.log("hexagon coords:", createHexagonCoords(10, 10));
        console.log("hexagon path:", createSvgPath(createHexagonCoords(10, 10)));
    });
});

