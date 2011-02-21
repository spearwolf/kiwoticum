
var CountryMapBuilder = function(options) {

    var conf = _.extend({
            width: 10,
            height: 10,
            hexagonWidth: 20,
            hexagonHeight: 20,
            startAtAngle: 90,
            paddingX: 4,
            paddingY: 4,
            hexagonFill: '#79b',
            hexagonStroke: '#024'
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

    var paper = Raphael(10, 50, canvasWidth, canvasHeight);

    function createHexagon(x, y, positionLeft, positionTop) {
        return {
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
        function getHexRef(x, y) {
            return (x >= 0 && x < conf.width && y >= 0 && y < conf.height) ? col[y][x] : null;
        }

        for (y = 0; y < conf.height; y++) {
            for (x = 0; x < conf.width; x++) {
                hexagon = col[y][x];
                hexagon.neighbor.north = getHexRef(x, y-1);
                hexagon.neighbor.south = getHexRef(x, y+1);
                hexagon.neighbor.northWest = getHexRef(x-1, y-1);
                hexagon.neighbor.southWest = getHexRef(x-1, y);
                hexagon.neighbor.northEast = getHexRef(x+1, y-1);
                hexagon.neighbor.southEast = getHexRef(x+1, y);
            }
        }

        return col;
    })();

    api.getHexagon = function(x, y) {
        return (x >= 0 && x < conf.width && y >= 0 && y < conf.height) ? hexagonModel[y][x] : null;
    };

    api.drawBaseHexagons = function() {
        var baseHexPath = createSvgPath(baseHexCoords),
            y, x, hexagon, model;

        function forwardOnClick(model_) {
            return function() { $(document).trigger("hexagon:click", model_); };
        }

        for (y = 0; y < conf.height; y++) {
            for (x = 0; x < conf.width; x++) {
                hexagon = paper.path(baseHexPath);
                hexagon.attr("fill", conf.hexagonFill);
                hexagon.attr("stroke", conf.hexagonStroke);

                model = api.getHexagon(x, y);
                model.elem = hexagon;
                hexagon.translate(model.left, model.top);
                hexagon.click(forwardOnClick(model));
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
            if (typeof hexagon.country === 'object') {
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
        var country = new Country(api.countries.length);
        api.countries.push(country);
        return country;
    };

    api.getCountry = function(id) {
        return api.countries[id];
    };

    return api;
};


jQuery(function($) {

    $(document).bind("hexagon:click", function(event, hexagon) {
        console.info("hexagon:click", "("+hexagon.x+","+hexagon.y+")", hexagon, event);
    });

    $("#startup form").bind("submit", function(event) {
        event.preventDefault();
        $(this).hide();

        var cmb = CountryMapBuilder({
            hexagonWidth: parseInt($(this.hexagonWidth).val(), 10),
            hexagonHeight: parseInt($(this.hexagonHeight).val(), 10),
            paddingX: parseInt($(this.paddingX).val(), 10),
            paddingY: parseInt($(this.paddingY).val(), 10),
            width: parseInt($(this.countryMapWidth).val(), 10),
            height: parseInt($(this.countryMapHeight).val(), 10)
        });
        cmb.drawBaseHexagons();
    });

    $("#startup > h3").click(function() { location.reload(true); });
});

