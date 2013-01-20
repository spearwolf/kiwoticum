kiwoticum.ui = kiwoticum.ui||{};
kiwoticum.ui.utils = kiwoticum.ui.utils||{};


kiwoticum.ui.utils.createSvgPath = function(coords) {
    return _.reduce(coords, function(path, v) {
        return path + (path === "" ? "M" : " L") + (Math.round(v[0]*100)/100) + " " + (Math.round(v[1]*100)/100);
    }, "") + " z";
};


kiwoticum.ui.SvgRenderer = function(canvasContainer, builder) {

    var api = {},
        paper = Raphael(canvasContainer, builder.getCanvasWidth(), builder.getCanvasHeight());

    var baseHexSvgPath = kiwoticum.ui.utils.createSvgPath(builder.baseHexCoords);

    function emitObj(eventName, eventObj) {
        return function() { _e.emit(eventName, eventObj); };
    }

    api.drawHexagon = function(hexagon, fillColor, strokeColor) {
        var hex = paper.path(baseHexSvgPath),
            stroke = (typeof strokeColor === 'undefined') ? builder.config.hexagonStroke : strokeColor;

        hex.attr("fill", fillColor);
        //hex.attr("stroke", builder.config.hexagonStroke);
        hex.attr("stroke", stroke);

        hex.translate(hexagon.left, hexagon.top);
        //hex.click(emitObj("kiwoticum/battlefield/hexagon/click", hexagon));

        return hex;
    };

    api.drawCountry = function(country) {
        var shapePath, inlinePath;

        // country outline shape (polygon)
        shapePath = paper.path(kiwoticum.ui.utils.createSvgPath(country.createShapePath()));
        shapePath.attr("fill", country.data.color);
        shapePath.attr("stroke-width", "1");
        shapePath.attr("stroke", "#000000");

        // inline shape
        inlinePath = paper.path(kiwoticum.ui.utils.createSvgPath(country.data.inlineShapePath));
        inlinePath.attr("fill", "rgba(0, 0, 0, 0.4)");
        inlinePath.attr("stroke-width", "0");

        // base hexagons
        //var hexagonShapes = [];
        //country.data.baseHexagons.forEach(function(hexagon) {
            //hexagonShapes.push(api.drawHexagon(hexagon, "rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.2)"));
        //});

        inlinePath.click(emitObj("kiwoticum/ui/select/country", country));

        // mouse over animation
        inlinePath.mouseover(function () {
            shapePath.stop().toFront().animate({ transform: "s1.1 1.1" }, 500, "elastic");
            inlinePath.stop().toFront().animate({ transform: "s1.1 1.1" }, 500, "elastic");
            //hexagonShapes.forEach(function(hexPath) { hexPath.toFront(); });
        }).mouseout(function () {
            shapePath.stop().animate({ transform: "" },  500, "elastic");
            inlinePath.stop().animate({ transform: "" },  500, "elastic");
        });

        inlinePath.click(function() {
            shapePath.remove();
            inlinePath.remove();
            //hexagonShapes.forEach(function(hexPath) { hexPath.remove(); });
        });
    };

    return api;
};

