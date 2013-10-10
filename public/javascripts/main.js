/*global kiwoticum iScroll */
jQuery(function($) {

    function createCountryMap(container) {
        var options = kiwoticum.builder.spw.getCountryMapBuilderConfig();
        options.hexagonInlineOffset = 4.5;

        var builder = kiwoticum.builder.CountryMapBuilder(options);
        builder.renderer = kiwoticum.ui.SvgRenderer(container, builder);

        builder.createCountries();
        builder.drawAll();
    }

    function centerCountryMapView(container) {
        if (!centerCountryMapView.elemSvg) {
            centerCountryMapView.elemSvg = $("svg", container);
        }
        var svg = centerCountryMapView.elemSvg,
            vw = svg.width(),
            vh = svg.height(),
            cw = $(container).width(),
            ch = $(container).height();
        if (cw > vw) {
            svg[0].style.left = ((cw - vw) * 0.5)|0 + 'px';
        } else {
            svg[0].style.left = '0px';
        }
        if (ch > vh) {
            svg[0].style.top = ((ch - vh) * 0.5)|0 + 'px';
        } else {
            svg[0].style.top = '0px';
        }
    }

    function createIScroll(container) {
        var iscroll = new iScroll(container, {
            hScroll: true,
            vScroll: true,
            lockDirection: false,
            zoom: true
        });

        $(window).resize(function() {
            centerCountryMapView(container);
            setTimeout(function() { iscroll.refresh(); }, 0);
        });
    }

    _e.on("kiwoticum/ui/select/country", function(country) {
        console.log("country selected", country);
    });


    var container = $("[data-behavior=country-map-view]")[0];

    createCountryMap(container);
    createIScroll(container);
    centerCountryMapView(container);
});
