"use strict";

var _ = require("underscore"), kiwoticum = {};

module.exports = kiwoticum;

kiwoticum.builder = kiwoticum.builder || {};

kiwoticum.builder.CountryMapBuilder = function(options) {
    var api = {}, conf = api.config = _.extend({
        width: 10,
        height: 10,
        hexagonWidth: 20,
        hexagonHeight: 20,
        startAtAngle: 90,
        paddingX: 0,
        paddingY: 0,
        hexagonInlineOffset: undefined,
        hexagonFill: "#79b",
        hexagonFill2: "#68a",
        hexagonStroke: "#024",
        gridWidth: 5,
        gridHeight: 5,
        hexagonExtension: null,
        countryExtension: null,
        createCountries: null
    }, options);
    api.renderer = null;
    api.getWidth = function() {
        return conf.width;
    };
    api.getHeight = function() {
        return conf.height;
    };
    api.createHexagonCoords = function(width, height, inlineOffset) {
        inlineOffset = inlineOffset !== undefined ? inlineOffset : 0;
        var mx = width / 2, my = height / 2, lx = mx - inlineOffset - 1, ly = my - inlineOffset - 1;
        return _.map([ 0, 1, 2, 3, 4, 5 ], function(n) {
            var r = (n * (360 / 6) + conf.startAtAngle) * (Math.PI / 180);
            if (inlineOffset === 0) {
                return [ Math.round(Math.sin(r) * lx + mx), Math.round(Math.cos(r) * ly + my) ];
            } else {
                return [ Math.sin(r) * lx + mx, Math.cos(r) * ly + my ];
            }
        });
    };
    var baseHexCoords = api.baseHexCoords = api.createHexagonCoords(conf.hexagonWidth, conf.hexagonHeight), inlineHexCoords = api.createHexagonCoords(conf.hexagonWidth, conf.hexagonHeight, conf.hexagonInlineOffset), stepX = baseHexCoords[5][0] - baseHexCoords[3][0], stepY = baseHexCoords[5][1] - baseHexCoords[1][1], stepY1 = baseHexCoords[0][1] - baseHexCoords[1][1], canvasWidth = (conf.width - 1) * stepX + (conf.width - 1) * conf.paddingX + conf.hexagonWidth, canvasHeight = (conf.height - 1) * stepY + (conf.height - 1) * conf.paddingY + conf.hexagonHeight + stepY1;
    api.getCanvasWidth = function() {
        return canvasWidth;
    };
    api.getCanvasHeight = function() {
        return canvasHeight;
    };
    function extendObject(obj, extension) {
        if (typeof extension === "object") {
            return _.extend(obj, extension);
        } else if (typeof extension === "function") {
            return _.extend(obj, new extension(obj));
        }
        return obj;
    }
    function createHexagon(x, y, positionLeft, positionTop) {
        var hex = {
            type: "Hexagon",
            x: x,
            y: y,
            top: positionTop,
            left: positionLeft,
            getVertexCoords: function(i) {
                return [ baseHexCoords[i][0] + this.left, baseHexCoords[i][1] + this.top ];
            },
            getInlineVertexCoords: function(i) {
                return [ inlineHexCoords[i][0] + this.left, inlineHexCoords[i][1] + this.top ];
            },
            elem: null,
            country: null,
            data: {},
            neighbor: {
                north: null,
                south: null,
                northWest: null,
                southWest: null,
                northEast: null,
                southEast: null
            },
            builder: api
        };
        return extendObject(hex, conf.hexagonExtension);
    }
    var hexagonModel = function() {
        var col = [], row, y, x, pixelX, pixelY, hexagon;
        for (y = 0; y < conf.height; y++) {
            row = [];
            for (x = 0; x < conf.width; x++) {
                pixelX = x * stepX + x * conf.paddingX;
                pixelY = y * stepY + y * conf.paddingY;
                if (x % 2 === 1) {
                    pixelY += stepY1;
                }
                row.push(createHexagon(x, y, pixelX, pixelY));
            }
            col.push(row);
        }
        var yOffset, _y;
        for (y = 0; y < conf.height; y++) {
            for (x = 0; x < conf.width; x++) {
                yOffset = x % 2;
                _y = y + yOffset;
                hexagon = col[y][x];
                if (x > 0) {
                    if (_y < conf.height) {
                        hexagon.neighbor.southWest = col[_y][x - 1];
                    }
                    if (_y > 0) {
                        hexagon.neighbor.northWest = col[_y - 1][x - 1];
                    }
                }
                if (y > 0) {
                    hexagon.neighbor.north = col[y - 1][x];
                }
                if (y < conf.height - 1) {
                    hexagon.neighbor.south = col[y + 1][x];
                }
                if (x < conf.width - 1) {
                    if (_y > 0) {
                        hexagon.neighbor.northEast = col[_y - 1][x + 1];
                    }
                    if (_y < conf.height) {
                        hexagon.neighbor.southEast = col[_y][x + 1];
                    }
                }
            }
        }
        return col;
    }();
    api.getHexagon = function(v) {
        return v[0] >= 0 && v[0] < conf.width && v[1] >= 0 && v[1] < conf.height ? hexagonModel[v[1]][v[0]] : null;
    };
    api.drawGroundHexagons = function(showHexagonFn) {
        if (!api.renderer) throw "renderer is null!";
        var y, x, hexagon, evenX, evenY, fillColor, showHexagon;
        for (y = 0; y < conf.height; y++) {
            for (x = 0; x < conf.width; x++) {
                hexagon = api.getHexagon([ x, y ]);
                if (!showHexagonFn || showHexagonFn(hexagon)) {
                    if (_.isUndefined(hexagon.data.color) && hexagon.country === null) {
                        evenX = Math.floor(x / conf.gridWidth) % 2 === 1;
                        evenY = Math.floor(y / conf.gridHeight) % 2 === 1;
                        fillColor = (evenY ? evenX : !evenX) ? conf.hexagonFill : conf.hexagonFill2;
                    } else {
                        fillColor = hexagon.country !== null ? hexagon.country.data.color : hexagon.data.color;
                    }
                    hexagon.elem = api.renderer.drawHexagon(hexagon, fillColor);
                }
            }
        }
    };
    function Country(id) {
        this.type = "Country";
        this.id = id;
        this.hexagons = [];
        this.neighbors = [];
        this.data = {};
        this.builder = api;
    }
    Country.prototype.unassignHexagon = function(hexagon) {
        var i;
        if (hexagon && (i = _.indexOf(this.hexagons, hexagon)) >= 0) {
            this.hexagons.splice(i, 1);
            hexagon.country = null;
        }
        return this;
    };
    Country.prototype.assignHexagon = function(hexagon) {
        if (hexagon && hexagon.country !== this) {
            if (hexagon.country !== null) {
                hexagon.country.unassignHexagon(hexagon);
            }
            hexagon.country = this;
            this.hexagons.push(hexagon);
            if (hexagon.neighbor.north) {
                this.addNeighbor(hexagon.neighbor.north.country);
            }
            if (hexagon.neighbor.south) {
                this.addNeighbor(hexagon.neighbor.south.country);
            }
            if (hexagon.neighbor.northWest) {
                this.addNeighbor(hexagon.neighbor.northWest.country);
            }
            if (hexagon.neighbor.southWest) {
                this.addNeighbor(hexagon.neighbor.southWest.country);
            }
            if (hexagon.neighbor.northEast) {
                this.addNeighbor(hexagon.neighbor.northEast.country);
            }
            if (hexagon.neighbor.southEast) {
                this.addNeighbor(hexagon.neighbor.southEast.country);
            }
        }
        return this;
    };
    Country.prototype.assignHexagons = function(coords) {
        var i, hexagon;
        for (i = 0; i < coords.length; i++) {
            hexagon = this.builder.getHexagon(coords[i]);
            if (hexagon) {
                this.assignHexagon(hexagon);
            }
        }
        return this;
    };
    Country.prototype.addNeighbor = function(country) {
        if (country && country !== this && _.indexOf(this.neighbors, country) < 0) {
            this.neighbors.push(country);
        }
        return this;
    };
    Country.prototype.nonUniqueCountryLessNeighborHexagons = function() {
        var neighbors = [];
        _.each(this.hexagons, function(hexagon) {
            if (hexagon.neighbor.north !== null && hexagon.neighbor.north.country === null) {
                neighbors.push(hexagon.neighbor.north);
            }
            if (hexagon.neighbor.south !== null && hexagon.neighbor.south.country === null) {
                neighbors.push(hexagon.neighbor.south);
            }
            if (hexagon.neighbor.northWest !== null && hexagon.neighbor.northWest.country === null) {
                neighbors.push(hexagon.neighbor.northWest);
            }
            if (hexagon.neighbor.southWest !== null && hexagon.neighbor.southWest.country === null) {
                neighbors.push(hexagon.neighbor.southWest);
            }
            if (hexagon.neighbor.northEast !== null && hexagon.neighbor.northEast.country === null) {
                neighbors.push(hexagon.neighbor.northEast);
            }
            if (hexagon.neighbor.southEast !== null && hexagon.neighbor.southEast.country === null) {
                neighbors.push(hexagon.neighbor.southEast);
            }
        });
        return neighbors;
    };
    Country.prototype.uniqueCountryLessNeighborHexagons = function() {
        return _.uniq(this.nonUniqueCountryLessNeighborHexagons());
    };
    Country.prototype.shapeHexagons = function() {
        var self = this;
        return _.select(this.hexagons, function(hexagon) {
            return hexagon.neighbor.north === null || hexagon.neighbor.north.country === null || hexagon.neighbor.north.country !== self || hexagon.neighbor.south === null || hexagon.neighbor.south.country === null || hexagon.neighbor.south.country !== self || hexagon.neighbor.northWest === null || hexagon.neighbor.northWest.country === null || hexagon.neighbor.northWest.country !== self || hexagon.neighbor.southWest === null || hexagon.neighbor.southWest.country === null || hexagon.neighbor.southWest.country !== self || hexagon.neighbor.northEast === null || hexagon.neighbor.northEast.country === null || hexagon.neighbor.northEast.country !== self || hexagon.neighbor.southEast === null || hexagon.neighbor.southEast.country === null || hexagon.neighbor.southEast.country !== self;
        });
    };
    Country.prototype.firstShapeHexagon = function() {
        var i, hexagon;
        for (i = 0; i < this.hexagons.length; i++) {
            hexagon = this.hexagons[i];
            if (hexagon.neighbor.north === null || hexagon.neighbor.north.country === null || hexagon.neighbor.north.country !== this || hexagon.neighbor.south === null || hexagon.neighbor.south.country === null || hexagon.neighbor.south.country !== this || hexagon.neighbor.northWest === null || hexagon.neighbor.northWest.country === null || hexagon.neighbor.northWest.country !== this || hexagon.neighbor.southWest === null || hexagon.neighbor.southWest.country === null || hexagon.neighbor.southWest.country !== this || hexagon.neighbor.northEast === null || hexagon.neighbor.northEast.country === null || hexagon.neighbor.northEast.country !== this || hexagon.neighbor.southEast === null || hexagon.neighbor.southEast.country === null || hexagon.neighbor.southEast.country !== this) {
                return hexagon;
            }
        }
    };
    Country.prototype.nextShapeHexagonEdge = function(hexagon, startAtEdge) {
        var i, neighbor = [ hexagon.neighbor.northEast, hexagon.neighbor.north, hexagon.neighbor.northWest, hexagon.neighbor.southWest, hexagon.neighbor.south, hexagon.neighbor.southEast ];
        if (typeof startAtEdge !== "number") {
            for (i = 0; i < 6; ++i) {
                if (neighbor[i] === null || neighbor[i].country !== hexagon.country) {
                    break;
                }
            }
            if (i !== 6) {
                startAtEdge = i;
            } else {
                return false;
            }
        }
        if (typeof hexagon.data.visitedEdges !== "object") {
            hexagon.data.visitedEdges = [ false, false, false, false, false, false ];
        }
        var visitedEdges = hexagon.data.visitedEdges;
        if (typeof hexagon.country.data.shapePath !== "object") {
            hexagon.country.data.shapePath = [];
            hexagon.country.data.inlineShapePath = [];
        }
        var shapePath = hexagon.country.data.shapePath, inlineShapePath = hexagon.country.data.inlineShapePath, edge;
        for (i = 0; i < 6; ++i) {
            edge = (startAtEdge + i) % 6;
            if (visitedEdges[edge]) {
                return false;
            }
            visitedEdges[edge] = true;
            if (neighbor[edge] === null || neighbor[edge].country !== hexagon.country) {
                break;
            }
        }
        if (i === 6) {
            return false;
        }
        var prevEdge = edge;
        do {
            shapePath.push(hexagon.getVertexCoords(edge));
            inlineShapePath.push(hexagon.getInlineVertexCoords(edge));
            visitedEdges[edge] = true;
            edge = (edge + 1) % 6;
        } while (!visitedEdges[edge] && (neighbor[edge] === null || neighbor[edge].country !== hexagon.country));
        if (edge === startAtEdge || visitedEdges[edge]) {
            return false;
        }
        if (prevEdge !== edge) {
            inlineShapePath.push(hexagon.getInlineVertexCoords(edge));
            var coords = [ hexagon.getVertexCoords(edge), hexagon.getVertexCoords((edge + 1) % 6) ];
            coords[1] = [ (coords[1][0] - coords[0][0]) * .65, (coords[1][1] - coords[0][1]) * .65 ];
            inlineShapePath.push([ coords[0][0] + coords[1][0], coords[0][1] + coords[1][1] ]);
        }
        return {
            hexagon: neighbor[edge],
            edge: [ 4, 5, 0, 1, 2, 3 ][edge]
        };
    };
    Country.prototype.createShapePath = function() {
        var next = this.nextShapeHexagonEdge(this.firstShapeHexagon());
        while (!!next) {
            next = this.nextShapeHexagonEdge(next.hexagon, next.edge);
        }
        return this.data.shapePath;
    };
    api.countries = [];
    api.createCountry = function() {
        var country = extendObject(new Country(api.countries.length), conf.countryExtension);
        api.countries.push(country);
        return country;
    };
    api.getCountry = function(id) {
        return api.countries[id];
    };
    api.createCountries = function() {
        if (conf.createCountries) {
            try {
                conf.createCountries(api, conf);
            } catch (ex) {
                console.error("createCountries() Error:", ex);
            }
        }
    };
    api.drawAll = function() {
        if (!api.renderer) throw "renderer is null!";
        if (api.renderer.beginRender) api.renderer.beginRender();
        if (_.isFunction(conf.drawAll)) {
            conf.drawAll(api, conf);
        } else {
            api.drawGroundHexagons();
        }
        if (api.renderer.endRender) api.renderer.endRender();
    };
    return api;
};

kiwoticum.builder = kiwoticum.builder || {};

kiwoticum.builder.spw = kiwoticum.builder.spw || {};

kiwoticum.builder.spw.createCountries = function(builder, options) {
    var width = builder.getWidth(), height = builder.getHeight(), COUNTRY_COLORS = [ "#ECD078", "#D95B43", "#C02942", "#542437", "#53777A" ];
    function randomPoint() {
        var x = Math.random() * (width - 1), y = Math.random() * (height - 1);
        return [ Math.round(x), Math.round(y) ];
    }
    function clampHexagonCoords(coords) {
        return [ coords[0] >= width ? width - 1 : coords[0], coords[1] >= height ? height - 1 : coords[1] ];
    }
    function gridToHexagonCoords(gridX, gridY) {
        return [ gridX * options.gridWidth, gridY * options.gridHeight ];
    }
    function randomPointOfGrid(gridX, gridY, paddingX, paddingY) {
        var coords = gridToHexagonCoords(gridX, gridY), px = typeof paddingX === "undefined" ? 0 : paddingX, py = typeof paddingY === "undefined" ? 0 : paddingY;
        coords[0] += px + Math.round(Math.random() * (options.gridWidth - 1 - px * 2));
        coords[1] += px + Math.round(Math.random() * (options.gridHeight - 1 - py * 2));
        return clampHexagonCoords(coords);
    }
    var noise = new kiwoticum.utils.SimplexNoise();
    function skipCountryGeneration(x, y) {
        return x === 0 || y === 0 || x > gridWidth - 2 || y > gridHeight - 2 || noise.noise(x / (options.gridWidth * .5), y / (options.gridHeight * .5)) < -.5;
    }
    var mainlands = [];
    function clearMainlands() {
        mainlands = _.reject(mainlands, function(mainland) {
            return mainland.countries.length === 0;
        });
        mainlands = _.sortBy(mainlands, function(mainland) {
            return -mainland.countries.length;
        });
    }
    function isBiggestMainland(mainland) {
        return mainland == mainlands[0];
    }
    function Mainland(country) {
        this.countries = [ country ];
        country.data.mainland = this;
        mainlands.push(this);
    }
    Mainland.prototype.assignCountry = function(country) {
        if (this != country.data.mainland) {
            this.countries.push(country);
            country.data.mainland = this;
        }
    };
    Mainland.prototype.merge = function(otherMainland) {
        if (this != otherMainland) {
            var self = this;
            otherMainland.countries.forEach(function(otherCountry) {
                self.assignCountry(otherCountry);
            });
            otherMainland.countries = [];
            clearMainlands();
        }
    };
    function assignHexagon(country, hexagon) {
        var neighborBeforeCount = country.neighbors.length;
        country.assignHexagon(hexagon);
        if (country.neighbors.length > neighborBeforeCount) {
            country.neighbors.forEach(function(_country) {
                country.data.mainland.merge(_country.data.mainland);
            });
        }
    }
    var x, y, point, hexagon, country, gridWidth = Math.round(width / options.gridWidth), gridHeight = Math.round(height / options.gridHeight);
    function assignBaseHexagon(country, hexagon) {
        country.assignHexagon(hexagon);
        country.data.baseHexagons.push(hexagon);
    }
    function makeCountry(gridX, gridY) {
        var country = builder.createCountry();
        country.data.gridPos = [ gridX, gridY ];
        country.data.mainland = new Mainland(country);
        var point = randomPointOfGrid(gridX, gridY, options.insideGridPaddingX, options.insideGridPaddingY);
        var hexagon = builder.getHexagon(point);
        country.assignHexagon(hexagon);
        country.data.baseHexagons = [ hexagon ];
        assignBaseHexagon(country, hexagon.neighbor.northWest);
        assignBaseHexagon(country, hexagon.neighbor.north);
        assignBaseHexagon(country, hexagon.neighbor.northEast);
        assignBaseHexagon(country, hexagon.neighbor.southWest);
        assignBaseHexagon(country, hexagon.neighbor.south);
        assignBaseHexagon(country, hexagon.neighbor.southEast);
        assignHexagon(country, hexagon.neighbor.north.neighbor.northWest);
        assignHexagon(country, hexagon.neighbor.north.neighbor.north);
        assignHexagon(country, hexagon.neighbor.north.neighbor.northEast);
        assignHexagon(country, hexagon.neighbor.south.neighbor.southWest);
        assignHexagon(country, hexagon.neighbor.south.neighbor.south);
        assignHexagon(country, hexagon.neighbor.south.neighbor.southEast);
        assignHexagon(country, hexagon.neighbor.northWest.neighbor.northWest);
        assignHexagon(country, hexagon.neighbor.northWest.neighbor.southWest);
        assignHexagon(country, hexagon.neighbor.southWest.neighbor.southWest);
        assignHexagon(country, hexagon.neighbor.northEast.neighbor.northEast);
        assignHexagon(country, hexagon.neighbor.northEast.neighbor.southEast);
        assignHexagon(country, hexagon.neighbor.southEast.neighbor.southEast);
        return country;
    }
    var countryGridCell = new Array(gridHeight);
    for (y = 0; y < gridHeight; y++) {
        countryGridCell[y] = new Array(gridWidth);
        for (x = 0; x < gridWidth; x++) {
            if (skipCountryGeneration(x, y)) {
                countryGridCell[y][x] = {
                    type: "Cell",
                    x: x,
                    y: y
                };
                continue;
            }
            countryGridCell[y][x] = makeCountry(x, y);
        }
    }
    function neighborCells(x, y) {
        return _.compact(_.map([ [ x - 1, y - 1 ], [ x, y - 1 ], [ x + 1, y - 1 ], [ x - 1, y ], [ x + 1, y ], [ x - 1, y + 1 ], [ x, y + 1 ], [ x + 1, y + 1 ] ], function(coord) {
            if (coord[0] >= 0 && coord[0] < gridWidth && coord[1] >= 0 && coord[1] < gridHeight) {
                return countryGridCell[coord[1]][coord[0]];
            }
        }));
    }
    function isCountry(cell) {
        return cell.type === "Country";
    }
    function isInnerCell(cell) {
        return cell.type === "Cell" && cell.x > 0 && cell.y > 0 && cell.x < gridWidth - 2 && cell.y < gridHeight - 2;
    }
    var neighborCountries, cells, cell;
    for (y = 0; y < gridHeight; y++) {
        for (x = 0; x < gridWidth; x++) {
            cell = countryGridCell[y][x];
            if (cell && cell.type === "Country") {
                cells = neighborCells(x, y);
                neighborCountries = _.filter(cells, isCountry);
                if (neighborCountries.length === 0) {
                    cells = _.filter(cells, isInnerCell);
                    cell = cells[_.random(0, cells.length - 1)];
                    countryGridCell[cell.y][cell.x] = makeCountry(cell.x, cell.y);
                }
            }
        }
    }
    function growCountry(country) {
        if (typeof country.couldNotGrowAnymore === "undefined") {
            var hexagon = country.randomCountryLessNeighborHexagon();
            if (hexagon) {
                assignHexagon(country, hexagon);
            } else {
                country.couldNotGrowAnymore = true;
                return false;
            }
        }
        return country.neighbors.length === 0;
    }
    for (var i = 0; i < options.growIterations; i++) {
        builder.countries.forEach(growCountry);
    }
    while (mainlands.length > 1) {
        growCountry(mainlands[1].countries[_.random(mainlands[1].countries.length - 1)]);
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

kiwoticum.builder.spw.getBuilderConfig = function() {
    return {
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
                    if (hexagon.neighbor.north !== null && this === hexagon.neighbor.north.country) {
                        ++countryNeighborCount;
                    }
                    if (hexagon.neighbor.south !== null && this === hexagon.neighbor.south.country) {
                        ++countryNeighborCount;
                    }
                    if (hexagon.neighbor.northWest !== null && this === hexagon.neighbor.northWest.country) {
                        ++countryNeighborCount;
                    }
                    if (hexagon.neighbor.southWest !== null && this === hexagon.neighbor.southWest.country) {
                        ++countryNeighborCount;
                    }
                    if (hexagon.neighbor.northEast !== null && this === hexagon.neighbor.northEast.country) {
                        ++countryNeighborCount;
                    }
                    if (hexagon.neighbor.southEast !== null && this === hexagon.neighbor.southEast.country) {
                        ++countryNeighborCount;
                    }
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
        drawAll: function(builder, options) {
            _.each(builder.countries, function(country) {
                builder.renderer.drawCountry(country);
            });
        },
        createCountries: kiwoticum.builder.spw.createCountries
    };
};

kiwoticum.builder.spw.getCountryMapBuilderConfig = function() {
    return _.extend({
        width: 80,
        height: 56,
        gridHeight: 8,
        gridWidth: 8,
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
            type: "fieldset",
            legend: "Wolfger's Country Algorithm",
            cssClass: "cmb-algorithm",
            inputs: [ {
                type: "title",
                text: "General Definition"
            }, {
                type: "number",
                name: "growIterations",
                value: 25,
                min: 1,
                max: 1e3,
                size: 5,
                label: "grow-iterations"
            } ]
        },
        builder_options: kiwoticum.builder.spw.getBuilderConfig()
    };
};

kiwoticum.utils = kiwoticum.utils || {};

kiwoticum.utils.SimplexNoise = function(r) {
    if (typeof r === "undefined") r = Math;
    this.grad3 = [ [ 1, 1, 0 ], [ -1, 1, 0 ], [ 1, -1, 0 ], [ -1, -1, 0 ], [ 1, 0, 1 ], [ -1, 0, 1 ], [ 1, 0, -1 ], [ -1, 0, -1 ], [ 0, 1, 1 ], [ 0, -1, 1 ], [ 0, 1, -1 ], [ 0, -1, -1 ] ];
    this.p = [];
    var i;
    for (i = 0; i < 256; i++) {
        this.p[i] = Math.floor(r.random() * 256);
    }
    this.perm = [];
    for (i = 0; i < 512; i++) {
        this.perm[i] = this.p[i & 255];
    }
    this.simplex = [ [ 0, 1, 2, 3 ], [ 0, 1, 3, 2 ], [ 0, 0, 0, 0 ], [ 0, 2, 3, 1 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 1, 2, 3, 0 ], [ 0, 2, 1, 3 ], [ 0, 0, 0, 0 ], [ 0, 3, 1, 2 ], [ 0, 3, 2, 1 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 1, 3, 2, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 1, 2, 0, 3 ], [ 0, 0, 0, 0 ], [ 1, 3, 0, 2 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 2, 3, 0, 1 ], [ 2, 3, 1, 0 ], [ 1, 0, 2, 3 ], [ 1, 0, 3, 2 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 2, 0, 3, 1 ], [ 0, 0, 0, 0 ], [ 2, 1, 3, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 2, 0, 1, 3 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 3, 0, 1, 2 ], [ 3, 0, 2, 1 ], [ 0, 0, 0, 0 ], [ 3, 1, 2, 0 ], [ 2, 1, 0, 3 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 3, 1, 0, 2 ], [ 0, 0, 0, 0 ], [ 3, 2, 0, 1 ], [ 3, 2, 1, 0 ] ];
};

kiwoticum.utils.SimplexNoise.prototype.dot = function(g, x, y) {
    return g[0] * x + g[1] * y;
};

kiwoticum.utils.SimplexNoise.prototype.noise = function(xin, yin) {
    var n0, n1, n2;
    var F2 = .5 * (Math.sqrt(3) - 1);
    var s = (xin + yin) * F2;
    var i = Math.floor(xin + s);
    var j = Math.floor(yin + s);
    var G2 = (3 - Math.sqrt(3)) / 6;
    var t = (i + j) * G2;
    var X0 = i - t;
    var Y0 = j - t;
    var x0 = xin - X0;
    var y0 = yin - Y0;
    var i1, j1;
    if (x0 > y0) {
        i1 = 1;
        j1 = 0;
    } else {
        i1 = 0;
        j1 = 1;
    }
    var x1 = x0 - i1 + G2;
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2;
    var y2 = y0 - 1 + 2 * G2;
    var ii = i & 255;
    var jj = j & 255;
    var gi0 = this.perm[ii + this.perm[jj]] % 12;
    var gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
    var gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
    var t0 = .5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0; else {
        t0 *= t0;
        n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
    }
    var t1 = .5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0; else {
        t1 *= t1;
        n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
    }
    var t2 = .5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0; else {
        t2 *= t2;
        n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
    }
    return 70 * (n0 + n1 + n2);
};

kiwoticum.utils.SimplexNoise.prototype.noise3d = function(xin, yin, zin) {
    var n0, n1, n2, n3;
    var F3 = 1 / 3;
    var s = (xin + yin + zin) * F3;
    var i = Math.floor(xin + s);
    var j = Math.floor(yin + s);
    var k = Math.floor(zin + s);
    var G3 = 1 / 6;
    var t = (i + j + k) * G3;
    var X0 = i - t;
    var Y0 = j - t;
    var Z0 = k - t;
    var x0 = xin - X0;
    var y0 = yin - Y0;
    var z0 = zin - Z0;
    var i1, j1, k1;
    var i2, j2, k2;
    if (x0 >= y0) {
        if (y0 >= z0) {
            i1 = 1;
            j1 = 0;
            k1 = 0;
            i2 = 1;
            j2 = 1;
            k2 = 0;
        } else if (x0 >= z0) {
            i1 = 1;
            j1 = 0;
            k1 = 0;
            i2 = 1;
            j2 = 0;
            k2 = 1;
        } else {
            i1 = 0;
            j1 = 0;
            k1 = 1;
            i2 = 1;
            j2 = 0;
            k2 = 1;
        }
    } else {
        if (y0 < z0) {
            i1 = 0;
            j1 = 0;
            k1 = 1;
            i2 = 0;
            j2 = 1;
            k2 = 1;
        } else if (x0 < z0) {
            i1 = 0;
            j1 = 1;
            k1 = 0;
            i2 = 0;
            j2 = 1;
            k2 = 1;
        } else {
            i1 = 0;
            j1 = 1;
            k1 = 0;
            i2 = 1;
            j2 = 1;
            k2 = 0;
        }
    }
    var x1 = x0 - i1 + G3;
    var y1 = y0 - j1 + G3;
    var z1 = z0 - k1 + G3;
    var x2 = x0 - i2 + 2 * G3;
    var y2 = y0 - j2 + 2 * G3;
    var z2 = z0 - k2 + 2 * G3;
    var x3 = x0 - 1 + 3 * G3;
    var y3 = y0 - 1 + 3 * G3;
    var z3 = z0 - 1 + 3 * G3;
    var ii = i & 255;
    var jj = j & 255;
    var kk = k & 255;
    var gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
    var gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
    var gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
    var gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;
    var t0 = .6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0; else {
        t0 *= t0;
        n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0);
    }
    var t1 = .6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0; else {
        t1 *= t1;
        n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1);
    }
    var t2 = .6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0; else {
        t2 *= t2;
        n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2);
    }
    var t3 = .6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0; else {
        t3 *= t3;
        n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3);
    }
    return 32 * (n0 + n1 + n2 + n3);
};

kiwoticum.builder = kiwoticum.builder || {};

kiwoticum.builder.JsonRenderer = function(builder) {
    var api = {};
    api.countryMapConfig = {
        hexagonSize: [ builder.getWidth(), builder.getHeight() ],
        canvasSize: [ builder.getCanvasWidth(), builder.getCanvasHeight() ],
        baseHexagonPath: builder.baseHexCoords,
        countries: []
    };
    api.drawHexagon = function(hexagon, fillColor) {};
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