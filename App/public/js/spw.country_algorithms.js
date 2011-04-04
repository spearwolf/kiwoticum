jQuery(function($) {

    Cevent.on("kiwoticum/battlefield/hexagon/click", function(hexagon) {
        console.log(hexagon);
        hexagon.setColor("#f0f0f0");
        var col = "#e0e0e0";
        hexagon.neighbor.north.setColor(col);
        hexagon.neighbor.south.setColor(col);
        hexagon.neighbor.northWest.setColor(col);
        hexagon.neighbor.southWest.setColor(col);
        hexagon.neighbor.northEast.setColor(col);
        hexagon.neighbor.southEast.setColor(col);
    });

    function createCountries(builder, options) {
        try {
            var width = builder.getWidth(),
                height = builder.getHeight(),
                COUNTRY_COLORS = [
                    "#cdada7",
                    "#140f0f",
                    "#9e6249", 
                    "#b6915f", 
                    "#5d4643", 
                    "#697297", 
                    "#c4c1be",
                    "#422927",
                    "#9f1d08", 
                    "#99798e", 
                    "#b85b3e", 
                    "#b38d6a" 
                ];

            function randomPoint() {
                var x = Math.random() * (width - 1),
                    y = Math.random() * (height - 1);
                return [Math.round(x), Math.round(y)];
            }

            function clampHexagonCoords(coords) {
                return [coords[0] >= width ? width - 1 : coords[0], coords[1] >= height ? height - 1 : coords[1]];
            }

            function gridToHexagonCoords(gridX, gridY) {
                return [gridX * options.gridWidth, gridY * options.gridHeight];
            }

            function randomPointOfGrid(gridX, gridY) {
                var coords = gridToHexagonCoords(gridX, gridY);
                coords[0] += Math.round(Math.random() * (options.gridWidth - 1));
                coords[1] += Math.round(Math.random() * (options.gridWidth - 1));
                return clampHexagonCoords(coords);
            }

            function skipCountryGeneration() {
                return (Math.random() * 100) < options.createCountryThreshold;
            }

            var x, y, point, hexagon, country,
                gridWidth = Math.round(width / options.gridWidth),
                gridHeight = Math.round(height / options.gridHeight);

            for (y = 0; y < gridHeight; y++) {
                for (x = 0; x < gridWidth; x++) {

                    if (skipCountryGeneration()) {
                        continue;
                    }

                    point = randomPointOfGrid(x, y);
                    hexagon = builder.getHexagon(point[0], point[1]);

                    country = builder.createCountry();
                    country.assignHexagon(hexagon);

                    console.log('point:', point, 'hexagon:', hexagon, 'country:', country);
                }
            }

            function growCountry(country) {
                var hexagon = country.randomCountryLessNeighborHexagon();
                if (hexagon) {
                    country.assignHexagon(hexagon);
                }
            }

            for (var i = 0; i < options.growIterations; i++) {
                _.each(builder.countries, growCountry);
            }

            for (i = 0; i < builder.countries.length; i++) {
                builder.countries[i].setColor(COUNTRY_COLORS[i % COUNTRY_COLORS.length]);
            }

        } catch (ex) {
            console.error("createCountries() Error:", ex);
        }
    }  // createCountries()

    Cevent.on("kiwoticum/country_map_builder/register/algorithm", function() {
        return {
            name: "wolfger's country algorithm",
            form: {
                type: 'fieldset',
                legend: 'Wolfger\'s Country Algorithm',
                cssClass: 'cmb-algorithm',
                inputs: [
                    { type: 'title', text: 'General Definition' },
                    { type: 'number', name: 'createCountryThreshold', value: 25, min: 1, max: 100, size: 5, label: 'create-country-threshold' },
                    { type: 'number', name: 'growIterations', value: 100, min: 1, max: 1000, size: 5, label: 'grow-iterations' }
                ]
            },
            builder_options: {

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
                        //_.each(this.hexagons, function(hexagon) {
                            //hexagon.setColor(color);
                        //});
                    },

                    randomCountryLessNeighborHexagon: function() {
                        var neighbors = this.countryLessNeighborHexagons();

                        if (neighbors.length === 0) {
                            return null;
                        }

                        var countryNeighborCount, hexagon;
                        for (var i = 0; i < neighbors.length; i++) {
                            hexagon = neighbors[i];
                            countryNeighborCount = 0;
                            if (hexagon.neighbor.north !== null && null !== hexagon.neighbor.north.country) { ++countryNeighborCount; }
                            if (hexagon.neighbor.south !== null && null !== hexagon.neighbor.south.country) { ++countryNeighborCount; }
                            if (hexagon.neighbor.northWest !== null && null !== hexagon.neighbor.northWest.country) { ++countryNeighborCount; }
                            if (hexagon.neighbor.southWest !== null && null !== hexagon.neighbor.southWest.country) { ++countryNeighborCount; }
                            if (hexagon.neighbor.northEast !== null && null !== hexagon.neighbor.northEast.country) { ++countryNeighborCount; }
                            if (hexagon.neighbor.southEast !== null && null !== hexagon.neighbor.southEast.country) { ++countryNeighborCount; }
                            if (countryNeighborCount >= 4) {
                                return hexagon;
                            }
                        }

                        return neighbors[Math.round(Math.random() * (neighbors.length - 1))];
                    }
                },

                createCountries: createCountries
            }
        };
    });
});
