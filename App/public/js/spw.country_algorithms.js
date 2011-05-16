jQuery(function($) {

    function spw_CreateCountries(builder, options) {  // {{{

        var width= builder.getWidth(), height= builder.getHeight(),
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
                    },

                    // TODO refactoring -- optimize for performance -- use hexagon.neighbor.sameCountryCount
                    randomCountryLessNeighborHexagon: function() {
                        var neighbors = this.nonUniqueCountryLessNeighborHexagons();

                        if (neighbors.length === 0) {
                            return null;
                        }

                        var countryNeighborCount,
                            hexagon,
                            prioNeighbors = [];

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
                    builder.drawGroundHexagons(function(hexagon) {
                        return hexagon.country !== null;
                    });
                }
            }
        };
    });
    // }}}

    function findBorderPath(hexagon, startAtIndex) {
        //
        //        _1
        //     2/   \ 0
        //     3\___/5
        //        4
        //
        if (typeof hexagon.data.visitedEdges !== 'object') {
            hexagon.data.visitedEdges = [false, false, false, false, false, false];
        }
        if (typeof hexagon.country.data.path !== 'object') {
            hexagon.country.data.path = [];
        }

        var neighbor = [hexagon.neighbor.northEast, hexagon.neighbor.north, hexagon.neighbor.northWest,
                            hexagon.neighbor.southWest, hexagon.neighbor.south, hexagon.neighbor.southEast];

        var i, j;
        for (j = 0; j < 6; ++j) {
            i = (startAtIndex + j) % 6;
            if (hexagon.data.visitedEdges[i]) {
                return false;
            }
            hexagon.data.visitedEdges[i] = true;
            if (neighbor[i] === null || neighbor[i].country !== hexagon.country) {
                break;
            }
        }
        if (j === 6) {
            hexagon.setColor("#ff0000");
            console.error("EX findBorderPath(", hexagon, ") couldn't find an edge?");
            return false;
        }

        hexagon.country.data.path.push(hexagon.getVertexCoords(i));
        i = (i+1) % 6;
        
        while (!hexagon.data.visitedEdges[i] &&
                (neighbor[i] === null || neighbor[i].country !== hexagon.country)) {
            hexagon.country.data.path.push(hexagon.getVertexCoords(i));
            i = (i+1) % 6;
        }

        hexagon.setColor("#00ff00");

        var nextEdge;
        switch (i) {
            case 0: nextEdge = 4; break;
            case 1: nextEdge = 5; break;
            case 2: nextEdge = 0; break;
            case 3: nextEdge = 1; break;
            case 4: nextEdge = 2; break;
            default: nextEdge = 3;
        }
        return [neighbor[i], nextEdge];
    }

    Cevent.on("kiwoticum/battlefield/hexagon/click", function(hexagon) {  // {{{
        try {
            var country = hexagon.country;
            if (!country) { return; }

            console.log("hexagon -->", hexagon, "country -->", country);

            var shapeHexagons = country.shapeHexagons();
            _.each(shapeHexagons, function(hex) {
                hex.setColor("#ffff00");
            });

            var next = findBorderPath(shapeHexagons[0], 0);
            while (!!next) {
                //console.log(next);
                next = findBorderPath(next[0], next[1]);
            }
            //console.log(next);
            //console.log("country.path", country.data.path);

            var countrySvgPath = hexagon.builder.paper.path(hexagon.builder.createSvgPath(country.data.path));
            countrySvgPath.attr("fill", country.data.color);
            countrySvgPath.attr("stroke", "#000000");
            //countrySvgPath.attr("stroke-width", "1");
            //countrySvgPath.attr("stroke-linecap", "round");

        } catch (ex) {
            console.error(ex);
        }
    });
    // }}}

});
