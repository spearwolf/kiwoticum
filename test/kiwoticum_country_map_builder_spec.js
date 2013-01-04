var should = require("should"),
    kiwoticum = require("../src/kiwoticum/country_map_builder");

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

describe("kiwoticum", function() {

    it("should exist and define the CountryMapBuilder", function() {
        should.exist(kiwoticum);
        should.exist(kiwoticum.CountryMapBuilder);
    });

});
