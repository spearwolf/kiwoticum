jQuery(function($) {

    function spw_CreateCountries(builder, options) {  // {{{

        var width= builder.getWidth(), height= builder.getHeight(),
            COUNTRY_COLORS = [
                "#cdada7",
                "#241f1f",
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

        for (y = 1; y < gridHeight - 1; y++) {
            for (x = 1; x < gridWidth - 1; x++) {

                if (skipCountryGeneration()) {
                    continue;
                }

                country = builder.createCountry();
                country.assignHexagon(builder.getHexagon(point = randomPointOfGrid(x, y)));
            }
        }

        function growCountry(country) {
            var hexagon = country.randomCountryLessNeighborHexagon();
            if (hexagon) {
                country.assignHexagon(hexagon);
            }
        }

        // TODO do not grow country which are not growable anymore after some iterations
        for (var i = 0; i < options.growIterations; i++) {
            _.each(builder.countries, growCountry);
        }

        for (i = 0; i < builder.countries.length; i++) {
            builder.countries[i].setColor(COUNTRY_COLORS[i % COUNTRY_COLORS.length]);
        }
    }
    // }}}

    Cevent.on("kiwoticum/country_map_builder/register/algorithm", function() {  // {{{
        return {
            name: "wolfger's country algorithm",
            form: {
                type: 'fieldset',
                legend: 'Wolfger\'s Country Algorithm',
                cssClass: 'cmb-algorithm',
                inputs: [
                    { type: 'title', text: 'General Definition' },
                    { type: 'number', name: 'createCountryThreshold', value: 25, min: 1, max: 100, size: 5, label: 'create-country-threshold' },
                    { type: 'number', name: 'growIterations', value: 25, min: 1, max: 1000, size: 5, label: 'grow-iterations' }
                ]
            },
            builder_options: {

                //hexagonExtension: {
                    //setColor: function(color) {
                        //this.data.color = color;
                        //if (this.elem) {
                            //this.elem.attr("fill", color);
                        //}
                    //}
                //},

                countryExtension: {

                    setColor: function(color) {
                        this.data.color = color;
                    },

                    randomCountryLessNeighborHexagon: function() {
                        var neighbors = this.nonUniqueCountryLessNeighborHexagons();

                        if (neighbors.length === 0) {
                            return null;
                        }

                        var countryNeighborCount, hexagon, prioNeighbors = [];

                        for (var i = 0; i < neighbors.length; i++) {
                            hexagon = neighbors[i];
                            countryNeighborCount = 0;
                            //if (hexagon.neighbor.north !== null && null !== hexagon.neighbor.north.country) { ++countryNeighborCount; }
                            //if (hexagon.neighbor.south !== null && null !== hexagon.neighbor.south.country) { ++countryNeighborCount; }
                            //if (hexagon.neighbor.northWest !== null && null !== hexagon.neighbor.northWest.country) { ++countryNeighborCount; }
                            //if (hexagon.neighbor.southWest !== null && null !== hexagon.neighbor.southWest.country) { ++countryNeighborCount; }
                            //if (hexagon.neighbor.northEast !== null && null !== hexagon.neighbor.northEast.country) { ++countryNeighborCount; }
                            //if (hexagon.neighbor.southEast !== null && null !== hexagon.neighbor.southEast.country) { ++countryNeighborCount; }
                            if (hexagon.neighbor.north !== null && this === hexagon.neighbor.north.country) { ++countryNeighborCount; }
                            if (hexagon.neighbor.south !== null && this === hexagon.neighbor.south.country) { ++countryNeighborCount; }
                            if (hexagon.neighbor.northWest !== null && this === hexagon.neighbor.northWest.country) { ++countryNeighborCount; }
                            if (hexagon.neighbor.southWest !== null && this === hexagon.neighbor.southWest.country) { ++countryNeighborCount; }
                            if (hexagon.neighbor.northEast !== null && this === hexagon.neighbor.northEast.country) { ++countryNeighborCount; }
                            if (hexagon.neighbor.southEast !== null && this === hexagon.neighbor.southEast.country) { ++countryNeighborCount; }
                            if (countryNeighborCount >= 5) {
                                return hexagon;
                            } else if (countryNeighborCount >= 2) {
                                prioNeighbors.push(hexagon);
                            }
                        }

                        if (prioNeighbors.length > 0) {
                            return prioNeighbors[Math.round(Math.random() * (prioNeighbors.length - 1))];
                        } else {
                            return neighbors[Math.round(Math.random() * (neighbors.length - 1))];
                        }
                    }
                },

                createCountries: spw_CreateCountries,

                drawAll: function(builder, options) {
                    
                    //builder.drawGroundHexagons(function(hexagon) {
                        //return hexagon.country === null;
                    //});

                    _.each(builder.countries, function(country) {
                        builder.renderer.drawCountry(country);
                    });
                }
            }
        };
    });
    // }}}

/*
    Cevent.on("kiwoticum/battlefield/hexagon/click", function(hexagon) {  // {{{
        try {
            var country = hexagon.country;
            if (!country) { return; }

            console.log("hexagon -->", hexagon, "country -->", country);

            var shapeHexagons = country.shapeHexagons();
            _.each(shapeHexagons, function(hex) {
                hex.setColor("#ffff00");
            });

            //console.log("start", shapeHexagons[0]);
            var next = country.nextShapeHexagonEdge(shapeHexagons[0]);
            while (!!next) {
                //console.log("next", next.hexagon, 'Edge: ', next.edge);
                next = country.nextShapeHexagonEdge(next.hexagon, next.edge);
            }

            var countrySvgPath = hexagon.builder.paper.path(hexagon.builder.createSvgPath(country.data.shapePath));
            countrySvgPath.attr("fill", country.data.color);
            countrySvgPath.attr("stroke", "#000000");
            //countrySvgPath.attr("stroke-width", "1");
            //countrySvgPath.attr("stroke-linecap", "round");

        } catch (ex) {
            console.error(ex);
        }
    });
    // }}}
*/
});
