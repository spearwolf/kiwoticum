var should = require("should"),
    fs = require('fs'),
    kiwoticum = require("../src/kiwoticum");


describe("kiwoticum.builder.JsonRenderer", function() {

    var cmbOptions, builder;

    it("Fetch builder-config from kiwoticum.builder.spw.getCountryMapBuilderConfig()", function() {
        cmbOptions = kiwoticum.builder.spw.getCountryMapBuilderConfig();

        should.exist(cmbOptions);
        should.exist(cmbOptions.createCountries);
        should.exist(cmbOptions.drawAll);
    });

    it("Create builder from config with kiwoticum.builder.CountryMapBuilder()", function() {
        builder = kiwoticum.builder.CountryMapBuilder(cmbOptions);

        should.exist(builder);

        should.exist(builder.createCountries);
        builder.createCountries.should.be.a('function');

        should.exist(builder.drawAll);
        builder.drawAll.should.be.a('function');
    });

    it("Add kiwoticum.builder.JsonRenderer() to builder", function() {
        builder.renderer = kiwoticum.builder.JsonRenderer(builder);

        should.exist(builder.renderer.countryMapConfig);
        builder.renderer.countryMapConfig.should.be.a('object');

        should.exist(builder.renderer.drawCountry);
        builder.renderer.drawCountry.should.be.a('function');
    });

    it("Create countries with builder.createCountries() and builder.drawAll()", function() {
        builder.createCountries();
        builder.drawAll();

        var countryMapConfig = builder.renderer.countryMapConfig;

        //console.log("\n", JSON.stringify(countryMapConfig, null, 4));
        fs.writeFile("test/kiwoticum_json_renderer_map.json", JSON.stringify(countryMapConfig, null, 4));

        countryMapConfig.countries.should.not.have.length(0);
    });
});
