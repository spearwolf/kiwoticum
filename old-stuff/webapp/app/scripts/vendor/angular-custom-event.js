// https://github.com/spearwolf/custom_event
(function(){
    "use strict";

    angular.module('spearwolf.custom-event', [])

        .factory('_e', ['$rootScope', function($rootScope) {

            _e.on('__CustomEventCallStackEnd__', function(){
                $rootScope.$apply();
            });

            return _e;
        }])

        .directive('ceOutput', ['_e', function(_e) {
            var listener;
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    listener = _e.on(attrs.ceOutput, function(output) {
                        var el = element[0];
                        if (typeof output !== 'undefined') {
                            el.innerHTML = output;
                        }
                    });
                    scope.$on('$destroy', function(){
                        listener.destroy();
                    });
                }
            };
        }])

        .directive('ceOutputAppend', ['_e', function(_e) {
            var listener;
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    listener = _e.on(attrs.ceOutputAppend, function(output) {
                        if (typeof output !== 'undefined') {
                            element.append(output);
                        }
                    });
                    scope.$on('$destroy', function(){
                        listener.destroy();
                    });
                }
            };
        }])

        ;
})();
