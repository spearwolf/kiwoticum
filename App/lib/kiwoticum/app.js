(function($) {
    kiwoticum.App = function() {

        function centerLoadingAnimation() {  // {{{
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
        // }}}
        function toggleLoading() {  // {{{
            var LOADING_CLASS = "loading",
                $body = $("body");
            if (!$body.hasClass(LOADING_CLASS)) {
                centerLoadingAnimation();
            }
            $body.toggleClass(LOADING_CLASS);
        }
        // }}}
        function calculatePlaygroundLayout(moreInfo) {  // {{{
            //if (window.screen.availWidth <= 1024) {
            $("#battlefield").css({ width: $(window).width(), height: $(window).height() });
            //}
            $("#status-bar").html('<p class="info">' + $(window).width() + 'x' + $(window).height() + " " + moreInfo + "</p>");

            setTimeout(function() { if (window.iScroller !== undefined) { window.iScroller.refresh(); } }, 0);
        }
        // }}}

        Cevent.on("kiwoticum/country_map_builder/form", function() {  // {{{

            Cevent.emit("kiwoticum/country_map_builder/register/algorithm", function() {

                var countryAlgorithms = _.select(arguments, function(algorithm) {
                    return (typeof algorithm === 'object') && _.isString(algorithm.name);
                });

                _.each(countryAlgorithms, function(algorithm) {
                    console.info("registered country algorithm:", algorithm.name);
                });

                // TODO merge form options from your country algorithm
                kiwoticum.App.formBuilder = kiwoticum.FormBuilder('country-map-builder-form', {
                    idPrefix: 'cmbf_',
                    fireSubmitEvent: 'kiwoticum/country_map_builder/start',
                    form: {
                        legend: 'Country Map Builder',
                        cssClass: 'cmb-general',
                        inputs: [
                            { type: 'title', text: 'Hexagon Definition' },
                            { type: 'number', name: 'hexagonWidth', value: 18, min: 5, max: 99, label: 'pixel-width' },
                            { type: 'number', name: 'hexagonHeight', value: 18, min: 5, max: 99, label: 'pixel-height' },
                            { type: 'number', name: 'hexagonInlineOffset', value: 4, min: 0, max: 99, label: 'inline-offset' },
                            { type: 'number', name: 'hexagonInlineOffset2', value: 0.5, min: 0.01, max: 1.0, label: 'inline-offset-2' },
                            { type: 'br' },
                            { type: 'number', name: 'paddingX', value: 0, min: 0, max: 99, label: 'padding-x' },
                            { type: 'number', name: 'paddingY', value: 0, min: 0, max: 99, label: 'padding-y' },
                            { type: 'br' },
                            { type: 'number', name: 'startAtAngle', value: 90, min: 0, max: 359, label: 'start-at-angle' },
                            { type: 'br' },
                            { type: 'text', name: 'hexagonFill', value: 'rgba(128, 128, 128, 0.5)', label: 'even-fill-color' },
                            { type: 'text', name: 'hexagonFill2', value: 'rgba(128, 128, 128, 0.25)', label: 'odd-fill-color' },
                            { type: 'text', name: 'hexagonStroke', value: '#333', label: 'stroke-color' },
                            { type: 'title', text: 'Map/Grid Definition' },
                            { type: 'number', name: 'width', value: 100, min: 10, max: 9999, label: 'width' },
                            { type: 'number', name: 'height', value: 100, min: 10, max: 9999, label: 'height' },
                            { type: 'number', name: 'gridWidth', value: 5, min: 1, max: 99, label: 'grid-width' },
                            { type: 'number', name: 'gridHeight', value: 5, min: 1, max: 99, label: 'grid-height' },
                            {
                                type: 'fieldset',
                                legend: 'Country Algorithm',
                                cssClass: 'cmb-select-algorithm',
                                inputs: [
                                    {
                                        type: 'select-country-algorithms',
                                        name: 'countryAlgorithm',
                                        label: 'country-algorithm',
                                        countryAlgorithms: countryAlgorithms
                                    }
                                ]
                            }
                        ]
                    }
                });
            });
        });
        // }}}
        Cevent.on("kiwoticum/country_map_builder/start", function(builderOptions) {  // {{{
            toggleLoading();
            console.info("builderOptions", builderOptions);

            kiwoticum.countryMapBuilder = kiwoticum.CountryMapBuilder("scrollable-canvas", builderOptions);
            setTimeout(function() {
                var t = new Date();
                kiwoticum.countryMapBuilder.createCountries();
                window.benchmarkCreateCountries = new Date() - t;
                console.log("createCountries: " + benchmarkCreateCountries + "ms");
                Cevent.emit("kiwoticum/show/battlefield");
            }, 1000);
        });
        // }}}
        Cevent.on("kiwoticum/show/battlefield", function() {  // {{{
            var t = new Date();
            kiwoticum.countryMapBuilder.drawAll();
            var benchmarkDrawAll = new Date() - t;
            console.log("drawAll: " + benchmarkDrawAll + "ms");

            var moreInfo = "&mdash; " + benchmarkCreateCountries + "ms / " + benchmarkDrawAll + "ms";

            calculatePlaygroundLayout(moreInfo);
            $("body").removeClass("loading").addClass("playing").bind("orientationchange", function(){
                calculatePlaygroundLayout(moreInfo);
            });

            function resizePlayground(extraInfo) {
                return function() { calculatePlaygroundLayout(extraInfo); };
            }
            $(window).resize(resizePlayground(moreInfo));

            $("#scrollable-canvas").css({
                width: kiwoticum.countryMapBuilder.getCanvasWidth()+100,
                height: kiwoticum.countryMapBuilder.getCanvasHeight()+60
            });
            window.iScroller = new iScroll("battlefield", {
                hScroll: true,
                vScroll: true,
                lockDirection: false,
                zoom: true
                //hScrollbar: false,
                //vScrollbar: false
            }); 
            iScroller.scrollTo(50, 50, 200, true);
        });
        // }}}

    };  // kiwoticum.App

    $(function() {  // trigger kiwoticum App startup on DOMReady
        kiwoticum.App();
        Cevent.emit("kiwoticum/country_map_builder/form");
    });

})(jQuery);
