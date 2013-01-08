var should = require("should"),
    _ = require("underscore"),
    kiwoticum = require("../src/kiwoticum");


var cmbOptions = {
    width: 10,
    height: 10,
    hexagonWidth: 16,
    hexagonHeight: 16,
    startAtAngle: 90,
    paddingX: 0,
    paddingY: 0,
    gridWidth: 5,
    gridHeight: 5,
    hexagonExtension: null,
    countryExtension: null,
    createCountries: null
};


function includeHexagonAt(hexagons, x, y) {
    var found = false;
    _.each(hexagons, function(hexagon) {
        if (x === hexagon.x && y === hexagon.y) {
            found = true;
        }
    });
    return found;
}


describe("kiwoticum.CountryMapBuilder()", function() {
    
    var builder, hexagon;

    before(function() {
        builder = kiwoticum.CountryMapBuilder(cmbOptions);
    });

    it("should return API", function() {
        builder.should.be.a('object');
    });

    describe("API", function() {

        it("config", function() {
            builder.should.have.ownProperty('config');
        });
        it("getWidth()", function() {
            builder.should.have.ownProperty('getWidth');
        });
        it("getHeight()", function() {
            builder.should.have.ownProperty('getHeight');
        });
        it("createHexagonCoords()", function() {
            builder.should.have.ownProperty('createHexagonCoords');
        });
        it("getCanvasWidth()", function() {
            builder.should.have.ownProperty('getCanvasWidth');
        });
        it("getCanvasHeight()", function() {
            builder.should.have.ownProperty('getCanvasHeight');
        });
        it("getHexagon()", function() {
            builder.should.have.ownProperty('getHexagon');
        });
        it("drawGroundHexagons()", function() {
            builder.should.have.ownProperty('drawGroundHexagons');
        });
        it("countries", function() {
            builder.should.have.ownProperty('countries');
        });
        it("createCountry()", function() {
            builder.should.have.ownProperty('createCountry');
        });
        it("getCountry()", function() {
            builder.should.have.ownProperty('getCountry');
        });
        it("createCountries()", function() {
            builder.should.have.ownProperty('createCountries');
        });
        it("drawAll()", function() {
            builder.should.have.ownProperty('drawAll');
        });
    });

    describe("#getHexagon()", function() {

        it("should return hexagon for [0, 0]", function() {
            hexagon = builder.getHexagon([0, 0]);
            hexagon.type.should.equal('Hexagon');
            hexagon.x.should.equal(0, 'hexagon.x should be 0');
            hexagon.y.should.equal(0, 'hexagon.y should be 0');
        });

        it("should return hexagon for [0, 9]", function() {
            hexagon = builder.getHexagon([0, 9]);
            hexagon.type.should.equal('Hexagon');
            hexagon.x.should.equal(0, 'hexagon.x should be 0');
            hexagon.y.should.equal(9, 'hexagon.y should be 9');
        });

        it("should return hexagon for [9, 0]", function() {
            hexagon = builder.getHexagon([9, 0]);
            hexagon.type.should.equal('Hexagon');
            hexagon.x.should.equal(9, 'hexagon.x should be 9');
            hexagon.y.should.equal(0, 'hexagon.y should be 0');
        });

        it("should return hexagon for [9, 9]", function() {
            hexagon = builder.getHexagon([9, 9]);
            hexagon.type.should.equal('Hexagon');
            hexagon.x.should.equal(9, 'hexagon.x should be 9');
            hexagon.y.should.equal(9, 'hexagon.y should be 9');
        });

        it("should return null for [10, 10]", function() {
            hexagon = builder.getHexagon([10, 10]);
            should.not.exist(hexagon);
        });
    });

    describe("hexagon neighbors", function() {

        //     __    __    __    __    __
        //    /0 \__/2 \__/  \__/  \__/8 \__
        //    \_0/1 \_0/  \__/  \__/  \_0/9 \
        //    /0 \_0/  \__/  \__/  \__/8 \_0/
        //    \_1/1 \__/  \__/  \__/  \_1/9 \
        //    /  \_1/  \__/  \__/  \__/  \_1/
        //    \__/  \__/  \__/  \__/  \__/  \
        //    /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //    /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //    /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //    /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //    /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //    /0 \__/  \__/  \__/  \__/  \__/
        //    \_8/1 \__/  \__/  \__/  \__/9 \
        //    /0 \_8/  \__/  \__/  \__/8 \_8/
        //    \_9/1 \__/  \__/  \__/  \_9/9 \
        //       \_9/  \__/  \__/  \__/  \_9/
        //

        it("[0, 0]", function() {
            hexagon = builder.getHexagon([0, 0]);

            should.not.exist( hexagon.neighbor.northEast, 'northEast');
            should.not.exist( hexagon.neighbor.north, 'north');
            should.not.exist( hexagon.neighbor.northWest, 'northWest');
            should.not.exist( hexagon.neighbor.southWest, 'southWest');
            should.exist( hexagon.neighbor.south, 'south');
            should.exist( hexagon.neighbor.southEast, 'southEast');

            hexagon.neighbor.south.x.should.equal(0, "southEast.x");
            hexagon.neighbor.south.y.should.equal(1, "southEast.y");
            hexagon.neighbor.southEast.x.should.equal(1, "southEast.x");
            hexagon.neighbor.southEast.y.should.equal(0, "southEast.y");
        });

        it("[0, 9]", function() {
            hexagon = builder.getHexagon([0, 9]);

            should.exist( hexagon.neighbor.northEast, 'northEast');
            should.exist( hexagon.neighbor.north, 'north');
            should.not.exist( hexagon.neighbor.northWest, 'northWest');
            should.not.exist( hexagon.neighbor.southWest, 'southWest');
            should.not.exist( hexagon.neighbor.south, 'south');
            should.exist( hexagon.neighbor.southEast, 'southEast');

            hexagon.neighbor.north.x.should.equal(0, "north.x");
            hexagon.neighbor.north.y.should.equal(8, "north.y");
            hexagon.neighbor.northEast.x.should.equal(1, "northEast.x");
            hexagon.neighbor.northEast.y.should.equal(8, "northEast.y");
            hexagon.neighbor.southEast.x.should.equal(1, "southEast.x");
            hexagon.neighbor.southEast.y.should.equal(9, "southEast.y");
        });

        it("[1, 9]", function() {
            hexagon = builder.getHexagon([1, 9]);

            should.exist( hexagon.neighbor.northEast, 'northEast');
            should.exist( hexagon.neighbor.north, 'north');
            should.exist( hexagon.neighbor.northWest, 'northWest');
            should.not.exist( hexagon.neighbor.southWest, 'southWest');
            should.not.exist( hexagon.neighbor.south, 'south');
            should.not.exist( hexagon.neighbor.southEast, 'southEast');
        });

        it("[1, 8]", function() {
            hexagon = builder.getHexagon([1, 8]);

            should.exist( hexagon.neighbor.northEast, 'northEast');
            should.exist( hexagon.neighbor.north, 'north');
            should.exist( hexagon.neighbor.northWest, 'northWest');
            should.exist( hexagon.neighbor.southWest, 'southWest');
            should.exist( hexagon.neighbor.south, 'south');
            should.exist( hexagon.neighbor.southEast, 'southEast');
        });

        it("[9, 9]", function() {
            hexagon = builder.getHexagon([9, 9]);

            should.not.exist( hexagon.neighbor.northEast, 'northEast');
            should.exist( hexagon.neighbor.north, 'north');
            should.exist( hexagon.neighbor.northWest, 'northWest');
            should.not.exist( hexagon.neighbor.southWest, 'southWest');
            should.not.exist( hexagon.neighbor.south, 'south');
            should.not.exist( hexagon.neighbor.southEast, 'southEast');

            hexagon.neighbor.north.x.should.equal(9, "north.x");
            hexagon.neighbor.north.y.should.equal(8, "north.y");
            hexagon.neighbor.northWest.x.should.equal(8, "northWest.x");
            hexagon.neighbor.northWest.y.should.equal(9, "northWest.y");
        });
    });

    describe("Country#uniqueCountryLessNeighborHexagons()", function() {

        //     0_ 1  2_ 3  4_ 5  6_ 7  8_ 9
        //  0 /  \__/  \__/  \__/  \__/c \__
        //    \__/a \__/b \__/  \__/  \__/C \
        //  1 /a \__/a \__/b \__/  \__/c \__/
        //    \__/A \_b/B \__/b \__/  \__/c \
        //  2 /a \__/a \__/B \__/  \__/  \__/
        //    \__/a \_b/b \__/b \__/  \__/  \
        //  3 /  \__/  \__/b \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //  4 /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //  5 /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //  6 /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //  7 /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //  8 /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //  9 /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //       \__/  \__/  \__/  \__/  \__/
        //

        var countryA, countryB, countryC,
            hexagons;
        
        before(function() {
            countryA = builder.createCountry().assignHexagons([[1, 1]]);
            countryB = builder.createCountry().assignHexagons([[3, 1], [4, 2]]);
            countryC = builder.createCountry().assignHexagons([[9, 0]]);
        });

        it("country A", function() {
            hexagons = countryA.uniqueCountryLessNeighborHexagons();

            hexagons.should.have.length(6);

            includeHexagonAt(hexagons, 1, 1).should.equal(false);

            includeHexagonAt(hexagons, 0, 1).should.equal(true);
            includeHexagonAt(hexagons, 1, 0).should.equal(true);
            includeHexagonAt(hexagons, 2, 1).should.equal(true);
            includeHexagonAt(hexagons, 2, 2).should.equal(true);
            includeHexagonAt(hexagons, 2, 1).should.equal(true);
            includeHexagonAt(hexagons, 0, 2).should.equal(true);
        });

        it("country B", function() {
            hexagons = countryB.uniqueCountryLessNeighborHexagons();

            hexagons.should.have.length(8);

            includeHexagonAt(hexagons, 3, 1).should.equal(false);
            includeHexagonAt(hexagons, 4, 2).should.equal(false);

            includeHexagonAt(hexagons, 3, 0).should.equal(true);
            includeHexagonAt(hexagons, 4, 1).should.equal(true);
            includeHexagonAt(hexagons, 5, 1).should.equal(true);
            includeHexagonAt(hexagons, 5, 2).should.equal(true);
            includeHexagonAt(hexagons, 4, 3).should.equal(true);
            includeHexagonAt(hexagons, 3, 2).should.equal(true);
            includeHexagonAt(hexagons, 2, 2).should.equal(true);
        });

        it("country C", function() {
            hexagons = countryC.uniqueCountryLessNeighborHexagons();

            hexagons.should.have.length(3);

            includeHexagonAt(hexagons, 9, 0).should.equal(false);

            includeHexagonAt(hexagons, 8, 0).should.equal(true);
            includeHexagonAt(hexagons, 8, 1).should.equal(true);
            includeHexagonAt(hexagons, 9, 1).should.equal(true);
        });
    });

    describe("Country#shapeHexagons()", function() {

        //     0_ 1  2_ 3  4_ 5  6_ 7  8_ 9
        //  0 /  \__/  \__/  \__/  \__/  \__
        //    \__/  \__/  \__/  \__/  \__/C \
        //  1 /  \__/  \__/  \__/  \__/  \__/
        //    \__/A \__/B \__/  \__/  \__/  \
        //  2 /  \__/  \__/B \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //  3 /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //  4 /  \__/D \__/D \__/  \__/  \__/
        //    \__/D \__/D \__/E \__/  \__/  \
        //  5 /D \__/d \__/D \__/  \__/  \__/
        //    \__/d \__/d \__/E \__/  \__/  \
        //  6 /D \__/D \__/D \__/  \__/  \__/
        //    \__/D \__/D \__/E \__/  \__/  \
        //  7 /D \__/  \__/E \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //  8 /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //  9 /  \__/  \__/  \__/  \__/  \__/
        //    \__/  \__/  \__/  \__/  \__/  \
        //       \__/  \__/  \__/  \__/  \__/
        //

        var countryA, countryB, countryC, countryD, countryE,
            hexagons;

        before(function() {
            builder = kiwoticum.CountryMapBuilder(cmbOptions);

            countryA = builder.createCountry().assignHexagons([[1, 1]]);
            countryB = builder.createCountry().assignHexagons([[3, 1], [4, 2]]);
            countryC = builder.createCountry().assignHexagons([[9, 0]]);
            countryD = builder.createCountry().assignHexagons([ [0, 5], [1, 4], [2, 4],
                                                                [0, 6], [1, 5], [2, 5], [3, 4], [4, 4],
                                                                [0, 7], [1, 6], [2, 6], [3, 5], [4, 5],
                                                                [3, 6], [4, 6] ]);
            countryE = builder.createCountry().assignHexagons([[5, 4], [5, 5], [5, 6], [4, 7]]);
        });

        it("country A", function() {
            hexagons = countryA.shapeHexagons();

            hexagons.should.have.length(1);

            includeHexagonAt(hexagons, 1, 1).should.equal(true);
        });

        it("country B", function() {
            hexagons = countryB.shapeHexagons();

            hexagons.should.have.length(2);

            includeHexagonAt(hexagons, 3, 1).should.equal(true);
            includeHexagonAt(hexagons, 4, 2).should.equal(true);
        });

        it("country C", function() {
            hexagons = countryC.shapeHexagons();

            hexagons.should.have.length(1);

            includeHexagonAt(hexagons, 9, 0).should.equal(true);
        });

        it("country D", function() {
            hexagons = countryD.shapeHexagons();

            hexagons.should.have.length(12);

            includeHexagonAt(hexagons, 1, 5).should.equal(false);
            includeHexagonAt(hexagons, 2, 5).should.equal(false);
            includeHexagonAt(hexagons, 3, 5).should.equal(false);

            includeHexagonAt(hexagons, 0, 5).should.equal(true);
            includeHexagonAt(hexagons, 1, 4).should.equal(true);
            includeHexagonAt(hexagons, 2, 4).should.equal(true);
            includeHexagonAt(hexagons, 0, 6).should.equal(true);
            includeHexagonAt(hexagons, 3, 4).should.equal(true);
            includeHexagonAt(hexagons, 4, 4).should.equal(true);
            includeHexagonAt(hexagons, 0, 7).should.equal(true);
            includeHexagonAt(hexagons, 1, 6).should.equal(true);
            includeHexagonAt(hexagons, 2, 6).should.equal(true);
            includeHexagonAt(hexagons, 4, 5).should.equal(true);
            includeHexagonAt(hexagons, 3, 6).should.equal(true);
            includeHexagonAt(hexagons, 4, 6).should.equal(true);
        });

    });

});
