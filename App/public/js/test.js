var QUnitTests = {};

var cmbOptions = {  // {{{
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
// }}}

QUnitTests.init = function () {

    module("kiwoticum.CountryMapBuilder", {
        setup: function () {  // {{{
            //console.log('QUnit: Executes before each test in the module');
        },
        // }}}
        teardown: function () {  // {{{
            //console.log('QUnit: Executes after each test in the module');
        }
        // }}}
    });

    function includeHexagonAt(hexagons, x, y) {  // {{{
        var found = false;
        _.each(hexagons, function(hexagon) {
            if (x === hexagon.x && y === hexagon.y) {
                found = true;
            }
        });
        return found;
    }
    // }}}

    test("CreateCountryMapBuilder()", 14, function () {  // {{{

        var builder = kiwoticum.CreateCountryMapBuilder("country-map-canvas", cmbOptions);
        ok(typeof builder === 'object', 'kiwoticum.CreateCountryMapBuilder() should return an object');

        var hexagon;
        hexagon = builder.getHexagon([0, 0]);
        strictEqual(hexagon.type, 'Hexagon', 'getHexagon([0, 0]) should return a valid Hexagon');
        strictEqual(hexagon.x, 0, 'hexagon.x should be 0');
        strictEqual(hexagon.y, 0, 'hexagon.y should be 0');

        hexagon = builder.getHexagon([0, 9]);
        strictEqual(hexagon.type, 'Hexagon', 'getHexagon([0, 9]) should return a valid Hexagon');
        strictEqual(hexagon.x, 0, 'hexagon.x should be 0');
        strictEqual(hexagon.y, 9, 'hexagon.y should be 9');

        hexagon = builder.getHexagon([9, 0]);
        strictEqual(hexagon.type, 'Hexagon', 'getHexagon([9, 0]) should return a valid Hexagon');
        strictEqual(hexagon.x, 9, 'hexagon.x should be 9');
        strictEqual(hexagon.y, 0, 'hexagon.y should be 0');

        hexagon = builder.getHexagon([9, 9]);
        strictEqual(hexagon.type, 'Hexagon', 'getHexagon([9, 9]) should return a valid Hexagon');
        strictEqual(hexagon.x, 9, 'hexagon.x should be 9');
        strictEqual(hexagon.y, 9, 'hexagon.y should be 9');

        hexagon = builder.getHexagon([10, 10]);
        strictEqual(hexagon, null, 'getHexagon([10, 10]) should return null');
    });
    // }}}

    test("Hexagon Neighbors", function () {  // {{{

        var builder = kiwoticum.CreateCountryMapBuilder("country-map-canvas", cmbOptions);

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

        var hexagon = builder.getHexagon([0, 0]);

        strictEqual(hexagon.neighbor.northWest, null, 'hexagon(0, 0).neighbor.northWest');
        strictEqual(hexagon.neighbor.north, null, 'hexagon(0, 0).neighbor.north');
        strictEqual(typeof hexagon.neighbor.northEast, 'object', 'hexagon(0, 0).neighbor.northEast');
        strictEqual(typeof hexagon.neighbor.southEast, 'object', 'hexagon(0, 0).neighbor.southWest');
        strictEqual(typeof hexagon.neighbor.south, 'object', 'hexagon(0, 0).neighbor.south');
        strictEqual(hexagon.neighbor.southWest, null, 'hexagon(0, 0).neighbor.southWest');

        strictEqual(hexagon.neighbor.southEast.x, 1, "hexagon(0, 0).neighbor.southEast.x");
        strictEqual(hexagon.neighbor.southEast.y, 0, "hexagon(0, 0).neighbor.southEast.y");

        hexagon = builder.getHexagon([0, 9]);

        strictEqual(hexagon.neighbor.northWest, null, 'hexagon(0, 9).neighbor.northWest');
        strictEqual(typeof hexagon.neighbor.north, 'object', 'hexagon(0, 9).neighbor.north');
        strictEqual(typeof hexagon.neighbor.northEast, 'object', 'hexagon(0, 9).neighbor.northEast');
        strictEqual(typeof hexagon.neighbor.southEast, 'object', 'hexagon(0, 9).neighbor.southEast');
        strictEqual(hexagon.neighbor.south, null, 'hexagon(0, 9).neighbor.south');
        strictEqual(hexagon.neighbor.southWest, null, 'hexagon(0, 9).neighbor.southWest');

        strictEqual(hexagon.neighbor.north.x, 0, "hexagon(0, 9).neighbor.north.x");
        strictEqual(hexagon.neighbor.north.y, 8, "hexagon(0, 9).neighbor.north.y");
        strictEqual(hexagon.neighbor.northEast.x, 1, "hexagon(0, 9).neighbor.northEast.x");
        strictEqual(hexagon.neighbor.northEast.y, 8, "hexagon(0, 9).neighbor.northEast.y");
        strictEqual(hexagon.neighbor.southEast.x, 1, "hexagon(0, 9).neighbor.southEast.x");
        strictEqual(hexagon.neighbor.southEast.y, 9, "hexagon(0, 9).neighbor.southEast.y");

        hexagon = builder.getHexagon([1, 9]);

        strictEqual(typeof hexagon.neighbor.northWest, 'object', 'hexagon(1, 9).neighbor.northWest');
        strictEqual(typeof hexagon.neighbor.north, 'object', 'hexagon(1, 9).neighbor.north');
        strictEqual(typeof hexagon.neighbor.northEast, 'object', 'hexagon(1, 9).neighbor.northEast');
        strictEqual(hexagon.neighbor.southEast, null, 'hexagon(1, 9).neighbor.southWest');
        strictEqual(hexagon.neighbor.south, null, 'hexagon(1, 9).neighbor.south');
        strictEqual(hexagon.neighbor.southWest, null, 'hexagon(1, 9).neighbor.southWest');

        hexagon = builder.getHexagon([1, 8]);

        strictEqual(typeof hexagon.neighbor.northWest, 'object', 'hexagon(1, 8).neighbor.northWest');
        strictEqual(typeof hexagon.neighbor.north, 'object', 'hexagon(1, 8).neighbor.north');
        strictEqual(typeof hexagon.neighbor.northEast, 'object', 'hexagon(1, 8).neighbor.northEast');
        strictEqual(typeof hexagon.neighbor.southEast, 'object', 'hexagon(1, 8).neighbor.southWest');
        strictEqual(typeof hexagon.neighbor.south, 'object', 'hexagon(1, 8).neighbor.south');
        strictEqual(typeof hexagon.neighbor.southWest, 'object', 'hexagon(1, 8).neighbor.southWest');

        hexagon = builder.getHexagon([9, 9]);

        strictEqual(typeof hexagon.neighbor.northWest, 'object', 'hexagon(9, 9).neighbor.northWest');
        strictEqual(typeof hexagon.neighbor.north, 'object', 'hexagon(9, 9).neighbor.north');
        strictEqual(hexagon.neighbor.northEast, null, 'hexagon(9, 9).neighbor.northEast');
        strictEqual(hexagon.neighbor.southEast, null, 'hexagon(9, 9).neighbor.southWest');
        strictEqual(hexagon.neighbor.south, null, 'hexagon(9, 9).neighbor.south');
        strictEqual(hexagon.neighbor.southWest, null, 'hexagon(9, 9).neighbor.southWest');

        strictEqual(hexagon.neighbor.northWest.x, 8, "hexagon(9, 9).neighbor.northWest.x");
        strictEqual(hexagon.neighbor.northWest.y, 9, "hexagon(9, 9).neighbor.northWest.y");
        strictEqual(hexagon.neighbor.north.x, 9, "hexagon(9, 9).neighbor.north.x");
        strictEqual(hexagon.neighbor.north.y, 8, "hexagon(9, 9).neighbor.north.y");
    });
    // }}}

    test("Country#uniqueCountryLessNeighborHexagons", function () {  // {{{

        var builder = kiwoticum.CreateCountryMapBuilder("country-map-canvas", cmbOptions);

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

        var countryA = builder.createCountry().assignHexagons([[1, 1]]),
            countryB = builder.createCountry().assignHexagons([[3, 1], [4, 2]]),
            countryC = builder.createCountry().assignHexagons([[9, 0]]);

        // A
        var hexagons = countryA.uniqueCountryLessNeighborHexagons();

        strictEqual(hexagons.length, 6);

        strictEqual(includeHexagonAt(hexagons, 1, 1), false);

        strictEqual(includeHexagonAt(hexagons, 0, 1), true);
        strictEqual(includeHexagonAt(hexagons, 1, 0), true);
        strictEqual(includeHexagonAt(hexagons, 2, 1), true);
        strictEqual(includeHexagonAt(hexagons, 2, 2), true);
        strictEqual(includeHexagonAt(hexagons, 2, 1), true);
        strictEqual(includeHexagonAt(hexagons, 0, 2), true);

        // B
        hexagons = countryB.uniqueCountryLessNeighborHexagons();

        strictEqual(hexagons.length, 8);

        strictEqual(includeHexagonAt(hexagons, 3, 1), false);
        strictEqual(includeHexagonAt(hexagons, 4, 2), false);

        strictEqual(includeHexagonAt(hexagons, 3, 0), true);
        strictEqual(includeHexagonAt(hexagons, 4, 1), true);
        strictEqual(includeHexagonAt(hexagons, 5, 1), true);
        strictEqual(includeHexagonAt(hexagons, 5, 1), true);
        strictEqual(includeHexagonAt(hexagons, 5, 2), true);
        strictEqual(includeHexagonAt(hexagons, 4, 3), true);
        strictEqual(includeHexagonAt(hexagons, 3, 2), true);
        strictEqual(includeHexagonAt(hexagons, 2, 2), true);

        // C
        hexagons = countryC.uniqueCountryLessNeighborHexagons();
        strictEqual(hexagons.length, 3);

        strictEqual(includeHexagonAt(hexagons, 9, 0), false);

        strictEqual(includeHexagonAt(hexagons, 8, 0), true);
        strictEqual(includeHexagonAt(hexagons, 8, 1), true);
        strictEqual(includeHexagonAt(hexagons, 9, 1), true);

    });
    // }}}

    test("Country#shapeHexagons", function () {  // {{{

        var builder = kiwoticum.CreateCountryMapBuilder("country-map-canvas", cmbOptions);

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

        var countryA = builder.createCountry().assignHexagons([[1, 1]]),
            countryB = builder.createCountry().assignHexagons([[3, 1], [4, 2]]),
            countryC = builder.createCountry().assignHexagons([[9, 0]]),
            countryD = builder.createCountry().assignHexagons([ [0, 5], [1, 4], [2, 4],
                                                                [0, 6], [1, 5], [2, 5], [3, 4], [4, 4],
                                                                [0, 7], [1, 6], [2, 6], [3, 5], [4, 5],
                                                                [3, 6], [4, 6] ]),
            countryE = builder.createCountry().assignHexagons([[5, 4], [5, 5], [5, 6], [4, 7]]);

        // A
        var hexagons = countryA.shapeHexagons();
        strictEqual(hexagons.length, 1);
        strictEqual(includeHexagonAt(hexagons, 1, 1), true);

        // B
        hexagons = countryB.shapeHexagons();
        strictEqual(hexagons.length, 2);
        strictEqual(includeHexagonAt(hexagons, 3, 1), true);
        strictEqual(includeHexagonAt(hexagons, 4, 2), true);

        // C
        hexagons = countryC.shapeHexagons();
        strictEqual(hexagons.length, 1);
        strictEqual(includeHexagonAt(hexagons, 9, 0), true);

        // D
        hexagons = countryD.shapeHexagons();
        strictEqual(hexagons.length, 12);

        strictEqual(includeHexagonAt(hexagons, 1, 5), false);
        strictEqual(includeHexagonAt(hexagons, 2, 5), false);
        strictEqual(includeHexagonAt(hexagons, 3, 5), false);

        strictEqual(includeHexagonAt(hexagons, 0, 5), true);
        strictEqual(includeHexagonAt(hexagons, 1, 4), true);
        strictEqual(includeHexagonAt(hexagons, 2, 4), true);
        strictEqual(includeHexagonAt(hexagons, 0, 6), true);
        strictEqual(includeHexagonAt(hexagons, 3, 4), true);
        strictEqual(includeHexagonAt(hexagons, 4, 4), true);
        strictEqual(includeHexagonAt(hexagons, 0, 7), true);
        strictEqual(includeHexagonAt(hexagons, 1, 6), true);
        strictEqual(includeHexagonAt(hexagons, 2, 6), true);
        strictEqual(includeHexagonAt(hexagons, 4, 5), true);
        strictEqual(includeHexagonAt(hexagons, 3, 6), true);
        strictEqual(includeHexagonAt(hexagons, 4, 6), true);
    });
    // }}}

    test("Country#nextShapeHexagonEdge", function () {  // {{{

        var builder = kiwoticum.CreateCountryMapBuilder("country-map-canvas", cmbOptions);

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

        var countryA = builder.createCountry().assignHexagons([[1, 1]]),
            countryB = builder.createCountry().assignHexagons([[3, 1], [4, 2]]),
            countryC = builder.createCountry().assignHexagons([[9, 0]]),
            countryD = builder.createCountry().assignHexagons([ [0, 5], [1, 4], [2, 4],
                                                                [0, 6], [1, 5], [2, 5], [3, 4], [4, 4],
                                                                [0, 7], [1, 6], [2, 6], [3, 5], [4, 5],
                                                                [3, 6], [4, 6] ]),
            countryE = builder.createCountry().assignHexagons([[5, 4], [5, 5], [5, 6], [4, 7]]);

        // A
        var hexagon = builder.getHexagon([1, 1]),
            next = countryA.nextShapeHexagonEdge(hexagon, 0);

        strictEqual(next, false, 'next');

        strictEqual(hexagon.data.visitedEdges[0], true, 'hexagon->visitedEdges[0]');
        strictEqual(hexagon.data.visitedEdges[1], true, 'hexagon->visitedEdges[1]');
        strictEqual(hexagon.data.visitedEdges[2], true, 'hexagon->visitedEdges[2]');
        strictEqual(hexagon.data.visitedEdges[3], true, 'hexagon->visitedEdges[3]');
        strictEqual(hexagon.data.visitedEdges[4], true, 'hexagon->visitedEdges[4]');
        strictEqual(hexagon.data.visitedEdges[5], true, 'hexagon->visitedEdges[5]');

        strictEqual(hexagon.country.data.shapePath.length, 6, 'shapePath.length');

        // B
        hexagon = builder.getHexagon([3, 1]);
        next = countryB.nextShapeHexagonEdge(hexagon, 0);

        strictEqual(typeof next, 'object', 'typeof next');
        strictEqual(next.length, 2, 'next.length');

        strictEqual(next[0].x, 4, 'next->hexagon->x');
        strictEqual(next[0].y, 2, 'next->hexagon->y');
        strictEqual(next[1], 3, 'next->edge');

        next = countryB.nextShapeHexagonEdge(next[0], next[1]);

        strictEqual(typeof next, 'object', 'typeof next(2)');
        strictEqual(next.length, 2, 'next(2).length');

        strictEqual(next[0].x, 3, 'next(2)->hexagon->x');
        strictEqual(next[0].y, 1, 'next(2)->hexagon->y');
        strictEqual(next[1], 0, 'next(2)->edge');

        next = countryB.nextShapeHexagonEdge(next[0], next[1]);
        strictEqual(next, false, 'next');
    });
    // }}}

};

(function ($) { QUnitTests.init(); })(jQuery);
