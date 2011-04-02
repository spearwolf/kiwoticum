window.kiwoticum = window.kiwoticum || {};

(function($) {
    kiwoticum.App = function() {

        kiwoticum.on = $CE.bind;
        kiwoticum.fire = $CE.fire;

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
        function calculatePlaygroundLayout() {  // {{{
            if (window.screen.availWidth <= 1024) {
                $("#battlefield").css({ width: $(window).width(), height: $(window).height() });
            }
            $("#status-bar").html('<p class="info">' + $(window).width() + 'x' + $(window).height() + "</p>");
        }
        // }}}

        kiwoticum.on("kiwoticum/init/country_map_builder_form", function() {  // {{{

            kiwoticum.App.FormBuilder = kiwoticum.CreateFormBuilder('country-map-builder-form', {
                idPrefix: 'cmbf_',
                fireSubmitEvent: 'kiwoticum/start/country_map_builder',
                form: {
                    legend: 'Country Map Builder',
                    cssClass: 'cmb-general',
                    inputs: [
                        { type: 'title', text: 'Hexagon Definition' },
                        { type: 'number', name: 'hexagonWidth', value: 30, min: 5, max: 99, label: 'pixel-width' },
                        { type: 'number', name: 'hexagonHeight', value: 30, min: 5, max: 99, label: 'pixel-height' },
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
                        { type: 'number', name: 'width', value: 40, min: 10, max: 9999, label: 'width' },
                        { type: 'number', name: 'height', value: 40, min: 10, max: 9999, label: 'height' },
                        { type: 'number', name: 'gridWidth', value: 8, min: 1, max: 99, label: 'grid-width' },
                        { type: 'number', name: 'gridHeight', value: 8, min: 1, max: 99, label: 'grid-height' },
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
        });
        // }}}
        kiwoticum.on("kiwoticum/start/country_map_builder", function(builderOptions) {  // {{{
            toggleLoading();
            console.info("builderOptions", builderOptions);
            kiwoticum.countryMapBuilder = kiwoticum.CreateCountryMapBuilder("scrollable-canvas", builderOptions);
            kiwoticum.fire("kiwoticum/show/battlefield");
        });
        // }}}
        kiwoticum.on("kiwoticum/show/battlefield", function() {  // {{{
            calculatePlaygroundLayout();
            $("body").removeClass("loading").addClass("playing").bind("orientationchange", function(){
                calculatePlaygroundLayout();
            });
            kiwoticum.countryMapBuilder.drawGroundHexagons();
            $("#scrollable-canvas").css({
                width: kiwoticum.countryMapBuilder.getCanvasWidth()+100,
                height: kiwoticum.countryMapBuilder.getCanvasHeight()+60
            });
            window.iScroll = new iScroll("battlefield", {
                hScroll: true,
                vScroll: true,
                lockDirection: false,
                zoom: true
                //hScrollbar: false,
                //vScrollbar: false
            }); 
            iScroll.scrollTo(50, 50, 200, true);
        });
        // }}}

    };  // kiwoticum.App

    $(function() {  // trigger kiwoticum App startup on DOMReady
        kiwoticum.App();
        kiwoticum.fire("kiwoticum/init/country_map_builder_form");
    });

})(jQuery);
