// Create object for QUnit tests
var QUnitTests = {};

/**
 * Executes QUnit tests
 */
QUnitTests.init = function () {

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

	module("kiwoticum.CountryMapBuilder", {
		setup: function () {
			//console.log('QUnit: Executes before each test in the module');
		},
		teardown: function () {
			//console.log('QUnit: Executes after each test in the module');
		}
	});

	test("CreateCountryMapBuilder()", 14, function () {

        var builder = kiwoticum.CreateCountryMapBuilder("country-map-canvas", cmbOptions);

		ok(typeof builder === 'object', 'kiwoticum.CreateCountryMapBuilder() should return an object');

        var hexagon;
       
        hexagon = builder.getHexagon([0, 0]);
		equals(hexagon.type, 'Hexagon', 'getHexagon([0, 0]) should return a valid Hexagon');
		equals(hexagon.x, 0, 'hexagon.x should be 0');
		equals(hexagon.y, 0, 'hexagon.y should be 0');

        hexagon = builder.getHexagon([0, 9]);
		equals(hexagon.type, 'Hexagon', 'getHexagon([0, 9]) should return a valid Hexagon');
		equals(hexagon.x, 0, 'hexagon.x should be 0');
		equals(hexagon.y, 9, 'hexagon.y should be 9');

        hexagon = builder.getHexagon([9, 0]);
		equals(hexagon.type, 'Hexagon', 'getHexagon([9, 0]) should return a valid Hexagon');
		equals(hexagon.x, 9, 'hexagon.x should be 9');
		equals(hexagon.y, 0, 'hexagon.y should be 0');

        hexagon = builder.getHexagon([9, 9]);
		equals(hexagon.type, 'Hexagon', 'getHexagon([9, 9]) should return a valid Hexagon');
		equals(hexagon.x, 9, 'hexagon.x should be 9');
		equals(hexagon.y, 9, 'hexagon.y should be 9');

        hexagon = builder.getHexagon([10, 10]);
		equals(hexagon, null, 'getHexagon([10, 10]) should return null');
	});

	test("Hexagon Neighbors", 34, function () {

        var builder = kiwoticum.CreateCountryMapBuilder("country-map-canvas", cmbOptions);
        var hexagon;
       
        hexagon = builder.getHexagon([0, 0]);

		equals(hexagon.neighbor.northWest, null, 'hexagon.neighbor.northWest should be null');
		equals(hexagon.neighbor.north, null, 'hexagon.neighbor.north should be null');
		equals(typeof hexagon.neighbor.northEast, 'object', 'hexagon.neighbor.northEast should be an object');
		equals(typeof hexagon.neighbor.southEast, 'object', 'hexagon.neighbor.southWest should be an object');
		equals(typeof hexagon.neighbor.south, 'object', 'hexagon.neighbor.south should be an object');
		equals(hexagon.neighbor.southWest, null, 'hexagon.neighbor.southWest should be null');

        hexagon = builder.getHexagon([0, 9]);

		equals(hexagon.neighbor.northWest, null, 'hexagon.neighbor.northWest should be null');
		equals(typeof hexagon.neighbor.north, 'object', 'hexagon.neighbor.north should be an object');
		equals(typeof hexagon.neighbor.northEast, 'object', 'hexagon.neighbor.northEast should be an object');
		equals(typeof hexagon.neighbor.southEast, 'object', 'hexagon.neighbor.southWest should be an object');
		equals(hexagon.neighbor.south, null, 'hexagon.neighbor.south should be null');
		equals(hexagon.neighbor.southWest, null, 'hexagon.neighbor.southWest should be null');

        hexagon = builder.getHexagon([1, 9]);

		equals(typeof hexagon.neighbor.northWest, 'object', 'hexagon.neighbor.northWest should be an object');
		equals(typeof hexagon.neighbor.north, 'object', 'hexagon.neighbor.north should be an object');
		equals(typeof hexagon.neighbor.northEast, 'object', 'hexagon.neighbor.northEast should be an object');
		equals(hexagon.neighbor.southEast, null, 'hexagon.neighbor.southWest should be null');
		equals(hexagon.neighbor.south, null, 'hexagon.neighbor.south should be null');
		equals(hexagon.neighbor.southWest, null, 'hexagon.neighbor.southWest should be null');

        hexagon = builder.getHexagon([1, 8]);

		equals(typeof hexagon.neighbor.northWest, 'object', 'hexagon.neighbor.northWest should be an object');
		equals(typeof hexagon.neighbor.north, 'object', 'hexagon.neighbor.north should be an object');
		equals(typeof hexagon.neighbor.northEast, 'object', 'hexagon.neighbor.northEast should be an object');
		equals(typeof hexagon.neighbor.southEast, 'object', 'hexagon.neighbor.southWest should be an object');
		equals(typeof hexagon.neighbor.south, 'object', 'hexagon.neighbor.south should be an object');
		equals(typeof hexagon.neighbor.southWest, 'object', 'hexagon.neighbor.southWest should be an object');

        hexagon = builder.getHexagon([9, 9]);

		equals(typeof hexagon.neighbor.northWest, 'object', 'hexagon.neighbor.northWest should be an object');
		equals(typeof hexagon.neighbor.north, 'object', 'hexagon.neighbor.north should be an object');
		equals(hexagon.neighbor.northEast, null, 'hexagon.neighbor.northEast should be null');
		equals(hexagon.neighbor.southEast, null, 'hexagon.neighbor.southWest should be null');
		equals(hexagon.neighbor.south, null, 'hexagon.neighbor.south should be null');
		equals(hexagon.neighbor.southWest, null, 'hexagon.neighbor.southWest should be null');

        equals(hexagon.neighbor.northWest.x, 8);
        equals(hexagon.neighbor.northWest.y, 9);
        equals(hexagon.neighbor.north.x, 9);
        equals(hexagon.neighbor.north.y, 8);
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
    //    /  \__/  \__/  \__/  \__/  \__/
    //    \__/1 \__/  \__/  \__/  \__/9 \
    //    /0 \_8/  \__/  \__/  \__/8 \_8/
    //    \_9/  \__/  \__/  \__/  \_9/9 \
    //       \__/  \__/  \__/  \__/  \_9/
    //
};

(function ($) { QUnitTests.init(); })(jQuery);
