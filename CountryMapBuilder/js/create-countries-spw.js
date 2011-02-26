jQuery(function($) {

    var options = {
        hexagonFill: '#aaa',
        hexagonStroke: '#000'
    };

    initCountryMapBuilder(options, function(builder) {
        console.info("spw country map algorithm, v0.1");

        var w = builder.getWidth(),
            h = builder.getHeight();

        var COUNTRIES_COUNT = 6,
            COUNTRY_COLORS = ["#d00", "#0d0", "#00d", "#dd0", "#d0d", "#0dd"],
            countries = [];

        function randomPoint() {
            var x = Math.random() * (w - 1),
                y = Math.random() * (h - 1);
            return [Math.round(x), Math.round(y)];
        }

        var i = 0, point, hexagon, col, country;
        while (i < COUNTRIES_COUNT) {
            point = randomPoint();

            hexagon = builder.getHexagon(point[0], point[1]);
            if (hexagon.country !== null) { continue; }

            col = COUNTRY_COLORS[i % COUNTRY_COLORS.length];
            hexagon.elem.attr("fill", col);

            country = builder.createCountry(); 
            country.data.color = col;
            country.assignHexagon(hexagon);

            console.log('point:', point, 'hexagon:', hexagon, 'country:', country);
            ++i;
        }

    });
});
