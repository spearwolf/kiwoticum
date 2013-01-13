kiwoticum.builder = kiwoticum.builder||{};
kiwoticum.builder.spw = kiwoticum.builder.spw||{};

kiwoticum.builder.spw.createCountries = function(builder, options) {  // {{{

    var width= builder.getWidth(), height= builder.getHeight(),
        COUNTRY_COLORS = [
            "#cdada7",
            "#241f1f",
            "#9e6249",
            "#b6915f",
            "#6d5653",
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

    var noise = new kiwoticum.utils.SimplexNoise();

    function skipCountryGeneration(x, y) {
        return x === 0 || y === 0 || x === options.gridWidth - 1 || y === options.gridHeight - 1 ||
            (noise.noise(x / (options.gridWidth * 0.5), y / (options.gridHeight * 0.5)) < -0.3);
    }

    var x, y, point, hexagon, country,
        gridWidth = Math.round(width / options.gridWidth),
        gridHeight = Math.round(height / options.gridHeight);

    for (y = 1; y < gridHeight - 1; y++) {
        for (x = 1; x < gridWidth - 1; x++) {

            if (skipCountryGeneration(x, y)) {
                continue;
            }

            country = builder.createCountry();
            country.assignHexagon(builder.getHexagon(point = randomPointOfGrid(x, y)));
        }
    }

    // returns true if country is growable and has no neighbor countries
    //   (..after assigning hexagon to it)
    function growCountry(country) {
        if (typeof country.couldNotGrowAnymore === 'undefined') {
            var hexagon = country.randomCountryLessNeighborHexagon();
            if (hexagon) {
                country.assignHexagon(hexagon);
            } else {
                country.couldNotGrowAnymore = true;
                return false;
            }
        }
        return country.neighbors.length === 0;
    }

    for (var i = 0; i < options.growIterations; i++) {
        _.each(builder.countries, growCountry);
    }

    var neighborLessCountries = _.select(builder.countries, function(country) {
        return country.neighbors.length === 0;
    });

    while (neighborLessCountries.length) {
        neighborLessCountries = _.select(neighborLessCountries, growCountry);
    }

    for (i = 0; i < builder.countries.length; i++) {
        builder.countries[i].setColor(COUNTRY_COLORS[i % COUNTRY_COLORS.length]);
    }
};
// }}}


kiwoticum.builder.spw.getBuilderConfig = function() {
    return {

        countryExtension: {  // {{{

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
        // }}}

        drawAll: function(builder, options) {  // {{{

            //builder.drawGroundHexagons(function(hexagon) {
                //return hexagon.country === null;
            //});

            _.each(builder.countries, function(country) {
                builder.renderer.drawCountry(country);
            });
        },
        // }}}

        createCountries: kiwoticum.builder.spw.createCountries

    };
};

kiwoticum.builder.spw.getCountryMapBuilderConfig = function() {
    return _.extend({

        width: 100,
        height: 100,
        gridHeight: 5,
        gridWidth: 5,

        growIterations: 25,

        hexagonWidth: 18,
        hexagonHeight: 18,
        hexagonInlineOffset: 4,
        hexagonInlineOffset2: 0.5,

        hexagonStroke: "#333",
        hexagonFill: "rgba(128,128,128,0.5)",
        hexagonFill2: "rgba(128,128,128,0.25)",

        paddingX: 0,
        paddingY: 0

    }, kiwoticum.builder.spw.getBuilderConfig());
};

kiwoticum.builder.spw.getCountryMapBuilderFormConfig = function() {

    return {
        name: "wolfger's country algorithm",
        form: {
            type: 'fieldset',
            legend: 'Wolfger\'s Country Algorithm',
            cssClass: 'cmb-algorithm',
            inputs: [
                { type: 'title', text: 'General Definition' },
                { type: 'number', name: 'growIterations', value: 25, min: 1, max: 1000, size: 5, label: 'grow-iterations' }
            ]
        },
        builder_options: kiwoticum.builder.spw.getBuilderConfig()
    };
};

/*
    _E.on("kiwoticum/battlefield/hexagon/click", function(hexagon) {  // {{{
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
