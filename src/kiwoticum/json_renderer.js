kiwoticum.ui = kiwoticum.ui||{};

kiwoticum.ui.JsonRenderer = function(builder) {

    var api = {};

    api.countryMapConfig = {
        hexagonSize: [builder.getWidth(), builder.getHeight()],
        canvasSize: [builder.getCanvasWidth(), builder.getCanvasHeight()],
        baseHexagonPath: builder.baseHexCoords,
        countries: []
    };

    api.drawHexagon = function(hexagon, fillColor) {
        //var hex = paper.path(baseHexSvgPath);

        //hex.attr("fill", fillColor);
        //hex.attr("stroke", builder.config.hexagonStroke);

        //hex.translate(hexagon.left, hexagon.top);
        //hex.click(emitObj("kiwoticum/battlefield/hexagon/click", hexagon));

        //return hex;
    };

    api.drawCountry = function(country) {
        var countryConfig = {};

        countryConfig.color = country.data.color;
        countryConfig.outlinePath = country.createShapePath();
        countryConfig.inlinePath = country.data.inlineShapePath;

        api.countryMapConfig.countries.push(countryConfig);

        countryConfig.id = api.countryMapConfig.countries.length;
    };

    return api;
};

