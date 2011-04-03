jQuery(function($) {

    Cevent.on("kiwoticum/country_map_builder/register/algorithm", function() {
        return {
            name: "wolfger's country algorithm",
            form: {
                type: 'fieldset',
                legend: 'Wolfger\'s Country Algorithm',
                cssClass: 'cmb-algorithm',
                inputs: [
                    { type: 'title', text: 'General Definition' },
                    { type: 'number', name: 'countryCount', value: 6, min: 1, max: 9999, size: 5, label: 'country-count' }
                ]
            },
            builder_options: {

                hexagonExtension: {
                    setColor: function(color) {
                        this.data.color = color;
                        if (this.elem) {
                            this.elem.attr("fill", color);
                        }
                    }
                },

                countryExtension: {
                    setColor: function(color) {
                        this.data.color = color;
                        _.each(this.hexagons, function(hexagon) {
                            hexagon.setColor(color);
                        });
                    }
                },

                createCountries: function(builder, options) {
                    var width = builder.getWidth(),
                        height = builder.getHeight(),
                        COUNTRY_COLORS = ["#d00", "#0d0", "#00d", "#dd0", "#d0d", "#0dd"],
                        countries = [];

                    function randomPoint() {
                        var x = Math.random() * (width - 1),
                            y = Math.random() * (height - 1);
                        return [Math.round(x), Math.round(y)];
                    }

                    var i = 0, point, hexagon, country;

                    while (i < options.countryCount) {
                        point = randomPoint();

                        hexagon = builder.getHexagon(point[0], point[1]);
                        if (hexagon.country !== null) {
                            continue;
                        }

                        country = builder.createCountry(); 
                        country.assignHexagon(hexagon);
                        country.setColor(COUNTRY_COLORS[i % COUNTRY_COLORS.length]);

                        console.log('point:', point, 'hexagon:', hexagon, 'country:', country);
                        ++i;
                    }

                }  // createCountries()
            }
        };
    });

});
