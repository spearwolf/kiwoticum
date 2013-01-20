jQuery(function($) {

    console.log("%ckiwoticum developer documentation", "font-weight:bold;font-size:120%;");

    function makeBaseHexagonDiagram(el) {
        var STROKE_WIDTH = 3,
            SCALE_HEIGHT = 0.8;

        var $el = $(el),
            width = $el.width(),
            height = $el.height(),
            hexSize = _.max([width-STROKE_WIDTH, height-STROKE_WIDTH]),

            paper = Raphael(el, width, height),

            builder = kiwoticum.builder.CountryMapBuilder({
                width: 1,
                height: 1,
                hexagonWidth: hexSize,
                hexagonHeight: (hexSize * SCALE_HEIGHT)|0
            });

        var baseHexPath = kiwoticum.ui.utils.createSvgPath(builder.baseHexCoords);

        console.log("baseHexCoords ->", builder.baseHexCoords);
        console.log("baseHexPath ->", baseHexPath);

        var shape = paper.path(baseHexPath);
        shape.attr("stroke-width", STROKE_WIDTH);
        shape.attr("stroke", "#204060");
        shape.attr("fill", "#f0f0ff");
        shape.translate(STROKE_WIDTH>>1, (hexSize * ((1.0 - SCALE_HEIGHT)/2.0))|0);
    }

    $("[data-behavior=diagram]").each(function(n, el) {
        if ($(el).attr("data-diagram") === "baseHexagon") {
            console.log("diagram -> baseHexagon", el);
            makeBaseHexagonDiagram(el);
        } else {
            console.log(n, el);
        }
    });

    /*
    function createCountryMap(container) {
        var options = kiwoticum.builder.spw.getCountryMapBuilderConfig(),
            builder = kiwoticum.builder.CountryMapBuilder(options);
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
    */
});
