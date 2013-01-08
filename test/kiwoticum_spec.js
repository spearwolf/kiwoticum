var should = require("should"),
    kiwoticum = require("../src/kiwoticum");

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

    it("should have CountryMapBuilder()", function() {
        should.exist(kiwoticum.CountryMapBuilder);
        kiwoticum.CountryMapBuilder.should.be.a('function');
    });

    it("should have spw.createCountries()", function() {
        should.exist(kiwoticum.spw.createCountries);
        kiwoticum.spw.createCountries.should.be.a('function');
    });

    it("should have spw.getCountryMapBuilderConfig()", function() {
        should.exist(kiwoticum.spw.getCountryMapBuilderConfig);
        kiwoticum.spw.getCountryMapBuilderConfig.should.be.a('function');
    });

    it("should have utils.SimplexNoise()", function() {
        should.exist(kiwoticum.utils.SimplexNoise);
        kiwoticum.utils.SimplexNoise.should.be.a('function');
    });
});
