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

    it("should have builder.CountryMapBuilder()", function() {
        should.exist(kiwoticum.builder.CountryMapBuilder);
        kiwoticum.builder.CountryMapBuilder.should.be.type('function');
    });

    it("should have builder.spw.createCountries()", function() {
        should.exist(kiwoticum.builder.spw.createCountries);
        kiwoticum.builder.spw.createCountries.should.be.type('function');
    });

    it("should have builder.spw.getCountryMapBuilderConfig()", function() {
        should.exist(kiwoticum.builder.spw.getCountryMapBuilderConfig);
        kiwoticum.builder.spw.getCountryMapBuilderConfig.should.be.type('function');
    });

    it("should have utils.SimplexNoise()", function() {
        should.exist(kiwoticum.utils.SimplexNoise);
        kiwoticum.utils.SimplexNoise.should.be.type('function');
    });
});
