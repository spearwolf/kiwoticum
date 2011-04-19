// Create object for QUnit tests
var QUnitTests = {};

/**
 * Executes QUnit tests
 */
QUnitTests.init = function () {

	module("foo", {
		setup: function () {
			console.log('QUnit: Executes before each test in the module');
		},
		teardown: function () {
			console.log('QUnit: Executes after each test in the module');
		}
	});

	test("test examples", 2, function () {

		ok(true, 'Should be true');

		equals(23, 23, 'Number should be 23');

	});
};

(function ($) { QUnitTests.init(); })(jQuery);
