window.kiwoticum = window.kiwoticum || {};

(function($) {
    window.kiwoticum.CreateFormBuilder = function(container, options) {

        var optionElements = [];

        function build_form_elements(root, opts) {
            var $container = _.isString(root) ? $("#"+root) : root;

            if ("legend" in opts) {
                var $el = $("<fieldset>");
                if ("cssClass" in opts) {
                    $el.addClass(opts.cssClass);
                }
                $container.append($el);
                $container = $el;
                $container.append($("<legend>").html(opts.legend));

                _.each(opts.inputs, function(item) {
                    var $input = null, $label = null, $p = null;

                    if ("label" in item) {
                        $label = $("<label>").attr("for", item.name).html(item.label);
                    }

                    switch (item.type) {
                        case "text":
                            $input = $("<input>")
                                        .attr("id", options.idPrefix+item.name)
                                        .attr("type", "text")
                                        .attr("name", item.name)
                                        .attr("size", "11")
                                        .attr("value", item.value);
                            optionElements.push($input);
                            break;
                        case "number":
                            $input = $("<input>")
                                        .attr("id", options.idPrefix+item.name)
                                        .attr("type", "number")
                                        .attr("name", item.name)
                                        .attr("min", item.min)
                                        .attr("max", item.max)
                                        .attr("size", "6")
                                        .attr("value", item.value);
                            optionElements.push($input);
                            break;
                        case "br":
                            $input = $("<p>").addClass("br");
                            break;
                        case "title":
                            $input = $("<h5>").html(item.text);
                            break;
                        case "fieldset":
                            build_form_elements(root, item);
                            break;
                        default:
                            // dnth
                    }
                    if (item.type != "title") {
                        $p = $("<p>");
                        if ($label) {
                            $p.append($label);
                        }
                        if ($input) {
                            $p.append($input);
                            $input.data("itemDescription", item);
                        }
                        if ($label || $input) {
                            $container.append($p);
                        }
                    } else {
                        $container.append($input);
                    }
                });
            }
            return $container;
        }

        var $container = build_form_elements(container, options.form).parent();

        $container.submit(function(event) {
            var builderOptions = {};
            _.each(optionElements, function (oe) {
                var item = oe.data("itemDescription");
                builderOptions[item.name] = item.type === 'number' ? parseInt(oe.val(), 10) : oe.val();
            });
            event.stopPropagation();
            $(document).trigger("kiwoticum:start:CountryMapBuilder", builderOptions);
            return false;
        });

        $container.append($("<p>").addClass("actions").append($("<input>").attr("type", "submit").attr("value", "Start!").addClass("uniformjsBtn")));
    };
})(jQuery);

jQuery(function($) {

    kiwoticum.CreateFormBuilder('country-map-builder-form', {
        idPrefix: 'cmbf_',
        form: {
            legend: 'Country Map Builder',
            cssClass: 'cmb-general',
            inputs: [
                { type: 'title', text: 'Hexagon Definition' },
                { type: 'number', name: 'hexagonWidth', value: 30, min: 5, max: 99, label: 'pixel-width' },
                { type: 'number', name: 'hexagonHeight', value: 20, min: 5, max: 99, label: 'pixel-height' },
                { type: 'br' },
                { type: 'number', name: 'paddingX', value: 4, min: 0, max: 99, label: 'padding-x' },
                { type: 'number', name: 'paddingY', value: 4, min: 0, max: 99, label: 'padding-y' },
                { type: 'br' },
                { type: 'number', name: 'startAtAngle', value: 90, min: 0, max: 359, label: 'start-at-angle' },
                { type: 'br' },
                { type: 'text', name: 'hexagonFill', value: '#79b', label: 'even-fill-color' },
                { type: 'text', name: 'hexagonFill2', value: '#68a', label: 'odd-fill-color' },
                { type: 'text', name: 'hexagonStroke', value: '#024', label: 'stroke-color' },
                { type: 'title', text: 'Map/Grid Definition' },
                { type: 'number', name: 'width', value: 30, min: 10, max: 9999, label: 'width' },
                { type: 'number', name: 'height', value: 20, min: 10, max: 9999, label: 'height' },
                { type: 'number', name: 'gridWidth', value: 5, min: 1, max: 99, label: 'grid-width' },
                { type: 'number', name: 'gridHeight', value: 5, min: 1, max: 99, label: 'grid-height' },
                {
                    type: 'fieldset',
                    legend: 'Country Algorithm',
                    cssClass: 'cmb-algorithm',
                    inputs: [
                        { type: 'title', text: 'General Definition' },
                        { type: 'number', name: 'countryCount', value: 6, min: 1, max: 9999, size: 5, label: 'country-count' }
                    ]
                }
            ]
        }
    });

    function toggleLoading() {
        var LOADING_CLASS = "loading",
            $body = $("body");
        if (!$body.hasClass(LOADING_CLASS)) {
            var $loadImg = $('.load-display > img'),
                imgWidth = $loadImg.width(),
                imgHeight = $loadImg.height(),
                imgTop, imgLeft;
            if (_.isNumber(window.innerHeight) && _.isNumber(window.pageYOffset)) {
                imgTop = window.innerHeight/2 + window.pageYOffset - imgHeight;
                imgLeft = window.innerWidth/2 + window.pageXOffset - imgWidth/2;
            } else {
                imgTop = $(window).height()/2 - imgHeight;
                imgLeft = $(window).width()/2 - imgWidth/2;
            }
            $loadImg.css({ top: Math.round(imgTop), left: Math.round(imgLeft)});
        }
        $body.toggleClass(LOADING_CLASS);
    }

    $(document).bind("kiwoticum:start:CountryMapBuilder", function(event, builderOptions) {
        toggleLoading();
        console.info(event.type, builderOptions);
        window.countryMapBuilder = kiwoticum.CreateCountryMapBuilder("scrollable-canvas", builderOptions);
    });

    function calculatePlaygroundLayout() {
        if (window.screen.availWidth <= 1024) {
            $("#battlefield").css({ width: $(window).width(), height: $(window).height() });
        }
        $("#status-bar").html('<p class="info">' + $(window).width() + 'x' + $(window).height() + "</p>");
    }

    $(document).bind("kiwoticum:start:playing", function(event) {
        calculatePlaygroundLayout();
        $("body").removeClass("loading").addClass("playing").bind("orientationchange", function(){
            calculatePlaygroundLayout();
        });
        window.iScroll = new iScroll("battlefield", {
            hScroll: true,
            vScroll: true
        }); 
        countryMapBuilder.drawGroundHexagons();
    });

    $(".load-display > *").click(function() {
        $(document).trigger("kiwoticum:start:playing");
    });
});

// vim: set ts=4:sw=4:sts=4:
