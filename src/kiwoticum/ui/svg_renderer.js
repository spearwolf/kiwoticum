kiwoticum.ui = kiwoticum.ui||{};

kiwoticum.ui.SvgRenderer = function(canvasContainer, builder) {

    var api = {},
        paper = Raphael(canvasContainer, builder.getCanvasWidth(), builder.getCanvasHeight());

    function createSvgPath(coords) {
        return _.reduce(coords, function(path, v) {
            return path + (path === "" ? "M" : " L") + (Math.round(v[0]*100)/100) + " " + (Math.round(v[1]*100)/100);
        }, "") + " z";
    }

    var baseHexSvgPath = createSvgPath(builder.baseHexCoords);

    function emitObj(eventName, eventObj) {
        return function() { _E.emit(eventName, eventObj); };
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
        var path;

        // country outline shape (polygon)
        path = paper.path(createSvgPath(country.createShapePath()));
        path.attr("fill", country.data.color);
        path.attr("stroke-width", "1");
        path.attr("stroke", "#000000");

        // inline shape
        path = paper.path(createSvgPath(country.data.inlineShapePath));
        path.attr("fill", "rgba(0, 0, 0, 0.4)");
        path.attr("stroke-width", "0");

        path.click(emitObj("kiwoticum/battlefield/country/click", country));

    };

    return api;
};

