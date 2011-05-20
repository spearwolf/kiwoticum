kiwoticum.SvgRenderer = function(canvasContainer, builder) {

    var api = {},
        paper = Raphael(canvasContainer, builder.getCanvasWidth(), builder.getCanvasHeight());

    function createSvgPath(coords) {
        return _.reduce(coords, function(path, v) {
            return path + (path === "" ? "M" : " L") + (Math.round(v[0]*100)/100) + " " + (Math.round(v[1]*100)/100);
        }, "") + " z";
    }

    var baseHexSvgPath = createSvgPath(builder.baseHexCoords);

    function emitObj(eventName, eventObj) {
        return function() { Cevent.emit(eventName, eventObj); };
    }

    api.drawHexagon = function(hexagon, fillColor) {
        var hex = paper.path(baseHexSvgPath);

        hex.attr("fill", fillColor);
        hex.attr("stroke", builder.config.hexagonStroke);

        hex.translate(hexagon.left, hexagon.top);
        hex.click(emitObj("kiwoticum/battlefield/hexagon/click", hexagon));

        return hex;
    };

    api.drawCountry = function(country) {
        var countrySvgPath = paper.path(createSvgPath(country.createShapePath()));
        countrySvgPath.attr("fill", country.data.color);
        countrySvgPath.attr("stroke", "#000000");
    };

    return api;
};
