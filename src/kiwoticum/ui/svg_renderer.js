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
        return function() { _e.emit(eventName, eventObj); };
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
        var shapePath, inlinePath;

        // country outline shape (polygon)
        shapePath = paper.path(createSvgPath(country.createShapePath()));
        shapePath.attr("fill", country.data.color);
        shapePath.attr("stroke-width", "1");
        shapePath.attr("stroke", "#000000");

        // inline shape
        inlinePath = paper.path(createSvgPath(country.data.inlineShapePath));
        inlinePath.attr("fill", "rgba(0, 0, 0, 0.4)");
        inlinePath.attr("stroke-width", "0");

        inlinePath.click(emitObj("kiwoticum/ui/select/country", country));

        // mouse over animation
        inlinePath.mouseover(function () {
            shapePath.stop().toFront().animate({ transform: "s1.1 1.1" }, 500, "elastic");
            inlinePath.stop().toFront().animate({ transform: "s1.1 1.1" }, 500, "elastic");
        }).mouseout(function () {
            shapePath.stop().animate({ transform: "" },  500, "elastic");
            inlinePath.stop().animate({ transform: "" },  500, "elastic");
        });
    };

    return api;
};

