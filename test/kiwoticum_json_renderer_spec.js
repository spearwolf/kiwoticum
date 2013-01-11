var should = require("should"),
    fs = require('fs'),
    kiwoticum = require("../src/kiwoticum");


describe("kiwoticum.ui.JsonRenderer", function() {

    var cmbOptions, builder;

    it("Fetch builder-config from kiwoticum.spw.getCountryMapBuilderConfig()", function() {
        cmbOptions = kiwoticum.spw.getCountryMapBuilderConfig();

        should.exist(cmbOptions);
        should.exist(cmbOptions.createCountries);
        should.exist(cmbOptions.drawAll);
    });

    it("Create builder from config with kiwoticum.CountryMapBuilder()", function() {
        builder = kiwoticum.CountryMapBuilder(cmbOptions);

        should.exist(builder);

        should.exist(builder.createCountries);
        builder.createCountries.should.be.a('function');

        should.exist(builder.drawAll);
        builder.drawAll.should.be.a('function');
    });

    it("Add kiwoticum.ui.JsonRenderer() to builder", function() {
        builder.renderer = kiwoticum.ui.JsonRenderer(builder);

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
