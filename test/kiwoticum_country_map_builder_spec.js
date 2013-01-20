var should = require("should"),
    _ = require("underscore"),
    kiwoticum = require("../src/kiwoticum");


var cmbOptions = {
    width: 10,
    height: 10
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


describe("kiwoticum.builder.CountryMapBuilder()", function() {
    
    var builder, hexagon;

    before(function() {
        builder = kiwoticum.builder.CountryMapBuilder(cmbOptions);
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

        describe("Hexagon#neighbor", function() {

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
    });

    describe("#createCountry()", function() {

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
                builder = kiwoticum.builder.CountryMapBuilder(cmbOptions);

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

        describe("Country#nextShapeHexagonEdge()", function() {

            //     0_ 1  2_ 3  4_ 5  6_ 7  8_ 9
            //  0 /  \__/  \__/  \__/  \__/  \__
            //    \__/  \__/  \__/  \__/  \__/C \
            //  1 /  \__/  \__/  \__/  \__/  \__/
            //    \__/A \__/B \__/  \__/  \__/  \
            //  2 /  \__/  \_1/B \__/  \__/  \__/
            //    \__/F \__/  \_2/  \__/  \__/  \
            //  3 /F \_3/F \__/  \__/  \__/  \__/
            //    \_4/F \_2/  \__/  \__/  \__/  \
            //  4 /F \_1/D \__/D \__/  \__/  \__/
            //    \_5/D \_2/D \12/E \__/  \__/  \
            //  5 /D \_3/d \_1/D \_2/  \__/  \__/
            //    \_4/d \__/d \11/E \__/  \__/  \
            //  6 /D \__/D \__/D \_1/  \__/  \__/
            //    \_5/D \_8/D \10/E \__/E \__/  \
            //  7 /D \_7/  \_9/E \_3/E \_6/  \__/
            //    \_6/  \__/  \_4/  \_5/  \__/  \
            //  8 /  \__/  \__/  \__/  \__/  \__/
            //    \__/  \__/  \__/  \__/  \__/  \
            //  9 /  \__/  \__/  \__/  \__/  \__/
            //    \__/  \__/  \__/  \__/  \__/  \
            //       \__/  \__/  \__/  \__/  \__/
            //

            var countryA, countryB, countryC, countryD, countryE, countryF,
                hexagon, next;

            function assertNext(next, hexCoords, edge, of) {
                should.exist(next);
                next.should.be.a('object', 'typeof next('+of+')');
                next.hexagon.x.should.equal(hexCoords[0], 'next('+of+')->hexagon->x');
                next.hexagon.y.should.equal(hexCoords[1], 'next('+of+')->hexagon->y');
                next.edge.should.equal(edge, 'next('+of+')->edge');
            }

            before(function() {
                builder = kiwoticum.builder.CountryMapBuilder(cmbOptions);

                countryA = builder.createCountry().assignHexagons([[1, 1]]);
                countryB = builder.createCountry().assignHexagons([[3, 1], [4, 2]]);
                countryC = builder.createCountry().assignHexagons([[9, 0]]);
                countryD = builder.createCountry().assignHexagons([ [3, 6], [2, 4], [2, 6], 
                                                                    [0, 6], [3, 4], [4, 4],
                                                                    [0, 7], [1, 6], [1, 4], [1, 5], [3, 5], [4, 5],
                                                                    [0, 5], [2, 5], [4, 6] ]);
                countryE = builder.createCountry().assignHexagons([[5, 4], [5, 5], [5, 6], [4, 7], [6, 7], [7, 6]]);
                countryF = builder.createCountry().assignHexagons([[0, 3], [1, 2], [2, 3], [0, 4], [1, 3]]);
            });

            it("country A", function() {
                hexagon = builder.getHexagon([1, 1]);
                next = countryA.nextShapeHexagonEdge(hexagon);

                next.should.equal(false, 'next');

                hexagon.data.visitedEdges[0].should.equal(true, 'hexagon->visitedEdges[0]');
                hexagon.data.visitedEdges[1].should.equal(true, 'hexagon->visitedEdges[1]');
                hexagon.data.visitedEdges[2].should.equal(true, 'hexagon->visitedEdges[2]');
                hexagon.data.visitedEdges[3].should.equal(true, 'hexagon->visitedEdges[3]');
                hexagon.data.visitedEdges[4].should.equal(true, 'hexagon->visitedEdges[4]');
                hexagon.data.visitedEdges[5].should.equal(true, 'hexagon->visitedEdges[5]');

                hexagon.country.data.shapePath.should.have.length(6, 'shapePath.length');
            });

            it("country B", function() {
                hexagon = builder.getHexagon([3, 1]);

                next = countryB.nextShapeHexagonEdge(hexagon);
                assertNext(next, [4, 2], 3, 'B1');

                next = countryB.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [3, 1], 0, 'B2');

                next = countryB.nextShapeHexagonEdge(next.hexagon, next.edge);
                next.should.equal(false, 'next');
            });

            it("country D", function() {
                hexagon = builder.getHexagon([3, 4]);

                next = countryD.nextShapeHexagonEdge(hexagon);
                assertNext(next, [2, 4], 0, 'D1');

                next = countryD.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [1, 4], 1, 'D2');

                next = countryD.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [0, 5], 1, 'D3');

                next = countryD.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [0, 6], 2, 'D4');

                next = countryD.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [0, 7], 2, 'D5');

                next = countryD.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [1, 6], 4, 'D6');

                next = countryD.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [2, 6], 4, 'D7');

                next = countryD.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [3, 6], 3, 'D8');

                next = countryD.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [4, 6], 4, 'D9');

                next = countryD.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [4, 5], 5, 'D10');

                next = countryD.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [4, 4], 5, 'D11');

                next = countryD.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [3, 4], 1, 'D12');

                next = countryD.nextShapeHexagonEdge(next.hexagon, next.edge);
                next.should.equal(false, 'next after D12');

                should.not.exist(builder.getHexagon([2, 5]).data.visitedEdges);
                should.not.exist(builder.getHexagon([1, 5]).data.visitedEdges);
                should.not.exist(builder.getHexagon([3, 5]).data.visitedEdges);
            });

            it("country E", function() {
                hexagon = builder.getHexagon([5, 5]);

                next = countryE.nextShapeHexagonEdge(hexagon);
                assertNext(next, [5, 4], 5, 'E1');

                next = countryE.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [5, 5], 2, 'E2');

                next = countryE.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [5, 6], 2, 'E1');

                next = countryE.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [4, 7], 1, 'E3');

                next = countryE.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [5, 6], 4, 'E4');

                next = countryE.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [6, 7], 3, 'E3');

                next = countryE.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [7, 6], 4, 'E5');

                next = countryE.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [6, 7], 1, 'E6');

                next = countryE.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [5, 6], 0, 'E5');

                next = countryE.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [5, 5], 5, 'E3');

                next = countryE.nextShapeHexagonEdge(next.hexagon, next.edge);
                next.should.equal(false, 'after E3');
            });

            it("country F", function() {
                hexagon = builder.getHexagon([1, 3]);

                next = countryF.nextShapeHexagonEdge(hexagon);
                assertNext(next, [2, 3], 4, 'F1');

                next = countryF.nextShapeHexagonEdge(next.hexagon, next.edge);
                assertNext(next, [1, 2], 0, 'F2');
            });
        });
    });

});
