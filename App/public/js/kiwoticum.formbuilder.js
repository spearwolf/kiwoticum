window.kiwoticum = window.kiwoticum || {};

(function($) {
    kiwoticum.CreateFormBuilder = function(container, options) {
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
                        case "select-country-algorithms":
                            $input = $("<select>")
                                        .attr("id", options.idPrefix+item.name)
                                        .attr("name", item.name)
                                        .attr("size", "1");
                            var first = true;
                            _.each(item.countryAlgorithms, function(algorithm) {
                                var $opt = $('<option>').html(algorithm.name);
                                if (first) {
                                    $opt.attr('selected', 'selected');
                                    first = false;
                                }
                                $input.append($opt);
                            });
                            optionElements.push($input);
                            build_form_elements(root, item.countryAlgorithms[0].form);
                            // TODO
                            //$input.change(function() {
                                //build_form_elements(root, algorithm.);
                            //});
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
                if (item.type === 'select-country-algorithms') {
                    _.extend(builderOptions, item.countryAlgorithms[0].builder_options);  // TODO
                } else {
                    builderOptions[item.name] = item.type === 'number' ? parseInt(oe.val(), 10) : oe.val();
                }
            });
            Cevent.emit(options.fireSubmitEvent, builderOptions);

            event.stopPropagation();
            return false;
        });

        $container.append($("<p>").addClass("actions").append($("<input>").attr("type", "submit").attr("value", "Start!").addClass("uniformjsBtn")));

        return {
            destroy: function() {
                $container.empty().html("");
            }
        };
    };
})(jQuery);

// vim: set ts=4:sw=4:sts=4:
