// Create object for QUnit tests
var QUnitTests = {};

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

var builder = kiwoticum.CreateCountryMapBuilder("country-map-canvas", cmbOptions);
var hexagon;

/**
 * Executes QUnit tests
 */
QUnitTests.init = function () {

	module("kiwoticum.CountryMapBuilder", {
		setup: function () {
			//console.log('QUnit: Executes before each test in the module');
		},
		teardown: function () {
			//console.log('QUnit: Executes after each test in the module');
		}
	});

	test("CreateCountryMapBuilder()", 14, function () {

		ok(typeof builder === 'object', 'kiwoticum.CreateCountryMapBuilder() should return an object');
       
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

	test("Hexagon Neighbors", function () {

        hexagon = builder.getHexagon([0, 0]);

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
};

(function ($) { QUnitTests.init(); })(jQuery);
