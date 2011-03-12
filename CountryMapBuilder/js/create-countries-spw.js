jQuery(function($) {

    var options = {

        hexagonFill: '#bbb',
        hexagonFill2: '#a5a5a5',
        hexagonStroke: '#000',
        gridWidth: 5,
        gridHeight: 5,

        hexagonExtension: {
            setColor: function(color) {
                this.data.color = color;
                if (this.elem) {
                    this.elem.attr("fill", color);
                }
            }
        },

        countryExtension: {
            setColor: function(color) {
                this.data.color = color;
                _.each(this.hexagons, function(hexagon) {
                    hexagon.setColor(color);
                });
            }
        }
    };

    initCountryMapBuilder(options, function(builder) {
        console.info("spw country map algorithm, v0.1");

        var width = builder.getWidth(),
            height = builder.getHeight(),
            COUNTRIES_COUNT = 6,
            COUNTRY_COLORS = ["#d00", "#0d0", "#00d", "#dd0", "#d0d", "#0dd"],
            countries = [];

        function randomPoint() {
            var x = Math.random() * (width - 1),
                y = Math.random() * (height - 1);
            return [Math.round(x), Math.round(y)];
        }

        var i = 0,
            point, hexagon, country;

        while (i < COUNTRIES_COUNT) {
            point = randomPoint();

            hexagon = builder.getHexagon(point[0], point[1]);
            if (hexagon.country !== null) {
                continue;
            }

            country = builder.createCountry(); 
            country.assignHexagon(hexagon);
            country.setColor(COUNTRY_COLORS[i % COUNTRY_COLORS.length]);

            console.log('point:', point, 'hexagon:', hexagon, 'country:', country);
            ++i;
        }

        builder.drawGroundHexagons();
    });
});
