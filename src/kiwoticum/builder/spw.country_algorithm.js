kiwoticum.builder = kiwoticum.builder||{};
kiwoticum.builder.spw = kiwoticum.builder.spw||{};

kiwoticum.builder.spw.createCountries = function(builder, options) {  // {{{

    var width= builder.getWidth(), height= builder.getHeight(),
        COUNTRY_COLORS = [ // {{{
            //"#cdada7",
            //"#241f1f",
            //"#9e6249",
            //"#b6915f",
            //"#6d5653",
            //"#697297",
            //"#c4c1be",
            //"#422927",
            //"#9f1d08",
            //"#99798e",
            //"#b85b3e",
            //"#b38d6a"

            // http://www.colourlovers.com/palette/694737/Thought_Provoking
            "#ECD078",
            "#D95B43",
            "#C02942",
            "#542437",
            "#53777A"

            // http://www.colourlovers.com/palette/1930/cheer_up_emo_kid
            //"#556270",
            //"#4ECDC4",
            //"#C7F464",
            //"#FF6B6B",
            //"#C44D58"

            //"#556270",
            //"#556270",
            //"#556270",
            //"#556270",
            //"#556270",
            //"#556270",
            //"#556270",
            //"#556270",
            //"#556270",
            //"#FF6B6B",
            //"#4ECDC4"

            // spw // http://www.colourlovers.com/palettes/add 
            //"#B59C7E",
            //"#6E786F",
            //"#A6A671",
            //"#7192A6",
            //"#A671A2"
        ];
        // }}}

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

    function randomPointOfGrid(gridX, gridY, paddingX, paddingY) {
        var coords = gridToHexagonCoords(gridX, gridY),
            px = (typeof paddingX === 'undefined') ? 0 : paddingX,
            py = (typeof paddingY === 'undefined') ? 0 : paddingY;

        coords[0] += px + Math.round(Math.random() * (options.gridWidth - 1 - (px*2)));
        coords[1] += px + Math.round(Math.random() * (options.gridHeight - 1 - (py*2)));
        return clampHexagonCoords(coords);
    }

    var noise = new kiwoticum.utils.SimplexNoise();

    function skipCountryGeneration(x, y) {
        return x === 0 || y === 0 || x === options.gridWidth - 1 || y === options.gridHeight - 1 ||
            (noise.noise(x / (options.gridWidth * 0.5), y / (options.gridHeight * 0.5)) < -0.5);
    }

    var x, y, point, hexagon, country,
        gridWidth = Math.round(width / options.gridWidth),
        gridHeight = Math.round(height / options.gridHeight);

    // A) Create Countries
    // ===================
    //
    function assignBaseHexagon(country, hexagon) {
        country.assignHexagon(hexagon);
        country.data.baseHexagons.push(hexagon);
    }

    for (y = 1; y < gridHeight - 1; y++) {
        for (x = 1; x < gridWidth - 1; x++) {

            if (skipCountryGeneration(x, y)) {
                continue;
            }

            country = builder.createCountry();
            point = randomPointOfGrid(x, y, options.insideGridPaddingX, options.insideGridPaddingY);
            hexagon = builder.getHexagon(point);
            country.assignHexagon(hexagon);
            country.data.baseHexagons = [hexagon];

            //     __    __    __    __    __
            //    /  \__/  \__/  \__/  \__/  \__
            //    \__/  \__/  \__/  \__/  \__/  \
            //    /  \__/  \__/  \__/  \__/  \__/
            //    \__/  \__/  \__/  \__/  \__/  \
            //    /  \__/  \__/  \__/  \__/  \__/
            //    \__/  \__/  \__/  \__/  \__/  \
            //    /  \__/  \__/n \__/  \__/  \__/
            //    \__/  \__/nw\__/ne\__/  \__/  \
            //    /  \__/nw\__/n \__/ne\__/  \__/
            //    \__/  \__/nw\_x/ne\__/  \__/  \
            //    /  \__/sw\_x/x \_x/se\__/  \__/
            //    \__/  \__/sw\__/se\__/  \__/  \
            //    /  \__/sw\_x/s \_x/se\__/  \__/
            //    \__/  \__/sw\_x/se\__/  \__/  \
            //    /  \__/  \__/s \__/  \__/  \__/
            //    \__/  \__/  \__/  \__/  \__/  \
            //    /  \__/  \__/  \__/  \__/  \__/
            //    \__/  \__/  \__/  \__/  \__/  \
            //    /  \__/  \__/  \__/  \__/  \__/
            //    \__/  \__/  \__/  \__/  \__/  \
            //       \__/  \__/  \__/  \__/  \__/
            //
            assignBaseHexagon(country, hexagon.neighbor.northWest);
            assignBaseHexagon(country, hexagon.neighbor.north);
            assignBaseHexagon(country, hexagon.neighbor.northEast);
            assignBaseHexagon(country, hexagon.neighbor.southWest);
            assignBaseHexagon(country, hexagon.neighbor.south);
            assignBaseHexagon(country, hexagon.neighbor.southEast);

            country.assignHexagon(hexagon.neighbor.north.neighbor.northWest);
            country.assignHexagon(hexagon.neighbor.north.neighbor.north);
            country.assignHexagon(hexagon.neighbor.north.neighbor.northEast);
            country.assignHexagon(hexagon.neighbor.south.neighbor.southWest);
            country.assignHexagon(hexagon.neighbor.south.neighbor.south);
            country.assignHexagon(hexagon.neighbor.south.neighbor.southEast);
            country.assignHexagon(hexagon.neighbor.northWest.neighbor.northWest);
            country.assignHexagon(hexagon.neighbor.northWest.neighbor.southWest);
            country.assignHexagon(hexagon.neighbor.southWest.neighbor.southWest);
            country.assignHexagon(hexagon.neighbor.northEast.neighbor.northEast);
            country.assignHexagon(hexagon.neighbor.northEast.neighbor.southEast);
            country.assignHexagon(hexagon.neighbor.southEast.neighbor.southEast);
        }
    }

    // B) Grow Countries
    // =================

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

    // C) Grow Countries Without Neighbors Until They Have One
    // =======================================================

    var neighborLessCountries = _.select(builder.countries, function(country) {
        return country.neighbors.length === 0;
    });

    while (neighborLessCountries.length) {
        neighborLessCountries = _.select(neighborLessCountries, growCountry);
    }

    // D) Set Country Colors (obsolete in future)
    // ==========================================

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

        width: 80, //100,
        height: 80, //100,
        gridHeight: 8, //5,
        gridWidth: 8, //5,
        insideGridPaddingX: 2,
        insideGridPaddingY: 2,

        growIterations: 30,

        hexagonWidth: 18,
        hexagonHeight: 18,
        hexagonInlineOffset: 4,
        hexagonInlineOffset2: 0,

        hexagonStroke: "#333",
        hexagonFill: "rgba(128,128,128,0.5)",
        hexagonFill2: "rgba(128,128,128,0.25)",

        paddingX: 1,
        paddingY: 1

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
