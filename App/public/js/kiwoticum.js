window.kiwoticum = window.kiwoticum || {};

kiwoticum.EVENT_NAMESPACE = 'kiwoticum';

kiwoticum.CreateCountryMapBuilder = function(container, options) {

    var conf = _.extend({
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
        }, options),
        api = {};

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

    function createSvgPath(coords) {
        return _.reduce(coords, function(path, v) {
            return path + (path === "" ? "M" : " L") + (Math.round(v[0]*100)/100) + " " + (Math.round(v[1]*100)/100);
        }, "") + " z";
    }

    var baseHexCoords = api.createHexagonCoords(conf.hexagonWidth, conf.hexagonHeight),
        stepX = baseHexCoords[5][0] - baseHexCoords[3][0],
        stepY = baseHexCoords[5][1] - baseHexCoords[1][1],
        stepY1 = baseHexCoords[0][1] - baseHexCoords[1][1],
        canvasWidth = ((conf.width - 1) * stepX) + ((conf.width - 1) * conf.paddingX) + conf.hexagonWidth,
        canvasHeight = ((conf.height - 1) * stepY) + ((conf.height - 1) * conf.paddingY) + conf.hexagonHeight + stepY1;

    api.getCanvasWidth = function() { return canvasWidth; };
    api.getCanvasHeight = function() { return canvasHeight; };

    var paper = Raphael(container, canvasWidth, canvasHeight);

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
            x: x,
            y: y,
            top: positionTop,
            left: positionLeft,
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
        for (y = 0; y < conf.height; y++) {
            for (x = 0; x < conf.width; x++) {
                hexagon = col[y][x];
                if (x > 0) {
                    hexagon.neighbor.southWest = col[y][x-1];
                    if (y > 0) {
                        hexagon.neighbor.northWest = col[y-1][x-1];
                    }
                }
                if (y > 0) {
                    hexagon.neighbor.north = col[y-1][x];
                }
                if (y < conf.height - 1) {
                    hexagon.neighbor.south = col[y+1][x];
                }
                if (x < conf.width - 1) {
                    if (y > 0) {
                        hexagon.neighbor.northEast = col[y-1][x+1];
                    }
                    hexagon.neighbor.southEast = col[y][x+1];
                }
            }
        }

        return col;
    })();

    api.getHexagon = function(x, y) {
        return (x >= 0 && x < conf.width && y >= 0 && y < conf.height) ? hexagonModel[y][x] : null;
    };

    api.drawGroundHexagons = function(showHexagonFn) {
        var baseHexPath = createSvgPath(baseHexCoords),
            y, x, hexagon,
            evenX, evenY, fillColor,
            showHexagon;

        function forwardOnClick(hexagon_) {
            return function() { jQuery(document).trigger(kiwoticum.EVENT_NAMESPACE + ":hexagon:click", hexagon_); };
        }

        for (y = 0; y < conf.height; y++) {
            for (x = 0; x < conf.width; x++) {
                hexagon = api.getHexagon(x, y);
                if (_.isUndefined(showHexagonFn) || showHexagonFn(hexagon)) {
                    hexagon.elem = paper.path(baseHexPath);

                    if (_.isUndefined(hexagon.data.color)) {
                        evenX = (Math.floor(x / conf.gridWidth) % 2) === 1;
                        evenY = (Math.floor(y / conf.gridHeight) % 2) === 1;
                        fillColor = (evenY ? evenX : !evenX) ? conf.hexagonFill : conf.hexagonFill2;
                    } else {
                        fillColor = hexagon.data.color;
                    }
                    hexagon.elem.attr("fill", fillColor);
                    hexagon.elem.attr("stroke", conf.hexagonStroke);

                    hexagon.elem.translate(hexagon.left, hexagon.top);
                    hexagon.elem.click(forwardOnClick(hexagon));
                }
            }
        }
    };

    //==============================================================
    // Country class
    //==============================================================
    function Country(id) {
        this.id = id;
        this.hexagons = [];
        this.neighbors = [];
        this.data = {};
    }

    Country.prototype.unassignHexagon = function(hexagon) {
        var i;
        if (typeof hexagon === 'object' && (i = _.indexOf(this.hexagons, hexagon)) >= 0) {
            this.hexagons[i] = null;
            this.hexagons = _.compact(this.hexagons);
            hexagon.country = null;
        }
    };

    Country.prototype.assignHexagon = function(hexagon) {
        if (typeof hexagon === 'object' && _.indexOf(this.hexagons, hexagon) < 0) {
            this.hexagons.push(hexagon);
            if (hexagon.country !== null) {
                hexagon.country.unassignHexagon(hexagon);
            }
            hexagon.country = this;
        }
    };

    Country.prototype.addNeighbor = function(country) {
        if (typeof country === 'object' && _.indexOf(this.neighbors, country) < 0) {
            this.neighbors.push(country);
        }
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

    // ===============================================

    api.createCountries = function() {
        if (_.isFunction(conf.createCountries)) {
            conf.createCountries(api, conf);
        }
    };

    api.drawAll = function() {
        if (_.isFunction(conf.drawAll)) {
            conf.drawAll(api, conf);
        } else {
            api.drawGroundHexagons();
        }
    };

    return api;
};

