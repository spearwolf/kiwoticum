window.kiwoticum = window.kiwoticum || {};

kiwoticum.CreateCountryMapBuilder = function(container, options) {

    var api = {}, conf = api.config = _.extend({
            width: 10,
            height: 10,
            hexagonWidth: 20,
            hexagonHeight: 20,
            startAtAngle: 90,
            paddingX: 4,
            paddingY: 4,
            hexagonFill: '#79b',
            hexagonFill2: '#68a',
            hexagonStroke: '#024',
            gridWidth: 4,
            gridHeight: 4,
            hexagonExtension: null,
            countryExtension: null,
            createCountries: null
        }, options);

    api.getWidth = function() { return conf.width; };
    api.getHeight = function() { return conf.height; };

    api.createHexagonCoords = function(width, height) {
        var mx = width/2.0, my = height/2.0,
            lx = mx - 1, ly = my - 1;

        return _.map([0, 1, 2, 3, 4, 5], function(n) {
            var r = (n*(360/6) + conf.startAtAngle) * (Math.PI / 180.0);
            return [Math.round(Math.sin(r) * lx + mx), Math.round(Math.cos(r) * ly + my)];
        });
    };

    var baseHexCoords = api.baseHexCoords = api.createHexagonCoords(conf.hexagonWidth, conf.hexagonHeight),
        stepX = baseHexCoords[5][0] - baseHexCoords[3][0],
        stepY = baseHexCoords[5][1] - baseHexCoords[1][1],
        stepY1 = baseHexCoords[0][1] - baseHexCoords[1][1],
        canvasWidth = ((conf.width - 1) * stepX) + ((conf.width - 1) * conf.paddingX) + conf.hexagonWidth,
        canvasHeight = ((conf.height - 1) * stepY) + ((conf.height - 1) * conf.paddingY) + conf.hexagonHeight + stepY1;

    api.getCanvasWidth = function() { return canvasWidth; };
    api.getCanvasHeight = function() { return canvasHeight; };

    function extendObject(obj, extension) {
        if (typeof extension === 'object') {
            return _.extend(obj, extension);
        } else if (typeof extension === 'function') {
            return _.extend(obj, new extension(obj));
        }
        return obj;
    }

    function createHexagon(x, y, positionLeft, positionTop) {
        var hex = {
            type: 'Hexagon',
            x: x,
            y: y,
            top: positionTop,
            left: positionLeft,
            getVertexCoords: function(i) {
                return [baseHexCoords[i][0] + this.left, baseHexCoords[i][1] + this.top];
            },
            elem: null,
            country: null,
            data: {},
            neighbor: {  // see Phase 2) of HexagonModel generation
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

    var hexagonModel = (function() {
        var col = [], row,
            y, x, pixelX, pixelY,
            hexagon;

        //===========================================================
        // Phase I) Build hexagon 2d array
        //===========================================================
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

        //===========================================================
        // Phase II) Create neighbor references
        //===========================================================
        var yOffset, _y;

        for (y = 0; y < conf.height; y++) {
            for (x = 0; x < conf.width; x++) {

                yOffset = x % 2;
                _y = y + yOffset;
                hexagon = col[y][x];

                if (x > 0) {
                    if (_y < conf.height) { hexagon.neighbor.southWest = col[_y][x-1]; }
                    if (_y > 0) { hexagon.neighbor.northWest = col[_y-1][x-1]; }
                }
                if (y > 0) { hexagon.neighbor.north = col[y-1][x]; }
                if (y < conf.height - 1) { hexagon.neighbor.south = col[y+1][x]; }
                if (x < conf.width - 1) {
                    if (_y > 0) { hexagon.neighbor.northEast = col[_y-1][x+1]; }
                    if (_y < conf.height) { hexagon.neighbor.southEast = col[_y][x+1]; }
                }
            }
        }

        return col;
    })();

    api.getHexagon = function(v) {
        return (v[0] >= 0 && v[0] < conf.width && v[1] >= 0 && v[1] < conf.height) ? hexagonModel[v[1]][v[0]] : null;
    };

    api.drawGroundHexagons = function(showHexagonFn) {
        var y, x, hexagon, evenX, evenY, fillColor, showHexagon; 

        for (y = 0; y < conf.height; y++) {
            for (x = 0; x < conf.width; x++) {
                hexagon = api.getHexagon([x, y]);
                if (!_.isFunction(showHexagonFn) || showHexagonFn(hexagon)) {

                    if (_.isUndefined(hexagon.data.color) && hexagon.country === null) {
                        evenX = (Math.floor(x / conf.gridWidth) % 2) === 1;
                        evenY = (Math.floor(y / conf.gridHeight) % 2) === 1;
                        fillColor = (evenY ? evenX : !evenX) ? conf.hexagonFill : conf.hexagonFill2;
                    } else {
                        fillColor = hexagon.country !== null ? hexagon.country.data.color : hexagon.data.color;
                    }
                    hexagon.elem = api.renderer.drawHexagon(hexagon, fillColor);
                }
            }
        }
    };

    //==============================================================
    // Country class
    //==============================================================
    function Country(id) {
        this.type = 'Country';
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
        if (hexagon && hexagon.country != this) {
            if (hexagon.country !== null) {
                hexagon.country.unassignHexagon(hexagon);
            }
            hexagon.country = this;
            this.hexagons.push(hexagon);
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
        if (country && _.indexOf(this.neighbors, country) < 0) {
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
            return hexagon.neighbor.north === null ||
                    hexagon.neighbor.north.country === null ||
                    hexagon.neighbor.north.country !== self ||
                    hexagon.neighbor.south === null ||
                    hexagon.neighbor.south.country === null ||
                    hexagon.neighbor.south.country !== self ||
                    hexagon.neighbor.northWest === null ||
                    hexagon.neighbor.northWest.country === null ||
                    hexagon.neighbor.northWest.country !== self ||
                    hexagon.neighbor.southWest === null ||
                    hexagon.neighbor.southWest.country === null ||
                    hexagon.neighbor.southWest.country !== self ||
                    hexagon.neighbor.northEast === null ||
                    hexagon.neighbor.northEast.country === null ||
                    hexagon.neighbor.northEast.country !== self ||
                    hexagon.neighbor.southEast === null ||
                    hexagon.neighbor.southEast.country === null ||
                    hexagon.neighbor.southEast.country !== self;
        });
    };

    Country.prototype.firstShapeHexagon = function() {
        var i, hexagon;
        for (i = 0; i < this.hexagons.length; i++) {
            hexagon = this.hexagons[i];
            if (hexagon.neighbor.north === null ||
                hexagon.neighbor.north.country === null ||
                hexagon.neighbor.north.country !== this ||
                hexagon.neighbor.south === null ||
                hexagon.neighbor.south.country === null ||
                hexagon.neighbor.south.country !== this ||
                hexagon.neighbor.northWest === null ||
                hexagon.neighbor.northWest.country === null ||
                hexagon.neighbor.northWest.country !== this ||
                hexagon.neighbor.southWest === null ||
                hexagon.neighbor.southWest.country === null ||
                hexagon.neighbor.southWest.country !== this ||
                hexagon.neighbor.northEast === null ||
                hexagon.neighbor.northEast.country === null ||
                hexagon.neighbor.northEast.country !== this ||
                hexagon.neighbor.southEast === null ||
                hexagon.neighbor.southEast.country === null ||
                hexagon.neighbor.southEast.country !== this) {
                return hexagon;
            }
        }
    };

    Country.prototype.nextShapeHexagonEdge = function(hexagon, startAtEdge) {
        //
        //       _1_
        //     2/   \0
        //     3\___/5
        //        4
        //

        var i, neighbor = [hexagon.neighbor.northEast, hexagon.neighbor.north, hexagon.neighbor.northWest,
                            hexagon.neighbor.southWest, hexagon.neighbor.south, hexagon.neighbor.southEast];

        // find startAtEdge
        if (typeof startAtEdge !== 'number') {
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

        // hexagon->visitedEdges
        if (typeof hexagon.data.visitedEdges !== 'object') {
            hexagon.data.visitedEdges = [false, false, false, false, false, false];
        }
        var visitedEdges = hexagon.data.visitedEdges;

        // country->shapePath
        if (typeof hexagon.country.data.shapePath !== 'object') {
            hexagon.country.data.shapePath = [];
        }
        var shapePath = hexagon.country.data.shapePath;

        var edge;
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
        // edge := first edge with adjacent (different|none) country

        do {
            shapePath.push(hexagon.getVertexCoords(edge));
            visitedEdges[edge] = true;
            edge = (edge + 1) % 6;
        } while (!visitedEdges[edge] && (neighbor[edge] === null || neighbor[edge].country !== hexagon.country));

        if (edge === startAtEdge || visitedEdges[edge]) {
            return false;
        }

        return { 
            hexagon: neighbor[edge], 
            edge: [4, 5, 0, 1, 2, 3][edge]
        };
    };

    Country.prototype.createShapePath = function() {
        var next = this.nextShapeHexagonEdge(this.firstShapeHexagon());
        while (!!next) {
            next = this.nextShapeHexagonEdge(next.hexagon, next.edge);
        }
        return this.data.shapePath;
    };

    //==============================================================

    api.countries = [];

    api.createCountry = function() {
        var country = extendObject(new Country(api.countries.length), conf.countryExtension);
        api.countries.push(country);
        return country;
    };

    api.getCountry = function(id) {
        return api.countries[id];
    };

    // =================== country algorithm api ===================

    api.createCountries = function() {
        if (_.isFunction(conf.createCountries)) {
            try {
                conf.createCountries(api, conf);
            } catch (ex) {
                console.error("createCountries() Error:", ex);
            }
        }
    };

    api.drawAll = function() {
        if (_.isFunction(conf.drawAll)) {
            conf.drawAll(api, conf);
        } else {
            api.drawGroundHexagons();
        }
    };

    // =============================================================

    api.renderer = kiwoticum.SvgRenderer(container, api);

    return api;
};

