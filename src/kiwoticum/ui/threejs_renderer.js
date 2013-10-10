/*global kiwoticum */
kiwoticum.ui = kiwoticum.ui||{};
kiwoticum.ui.utils = kiwoticum.ui.utils||{};

/*
kiwoticum.ui.utils.createSvgPath = function(coords) {
    return _.reduce(coords, function(path, v) {
        return path + (path === "" ? "M" : " L") + (Math.round(v[0]*100)/100) + " " + (Math.round(v[1]*100)/100);
    }, "") + " z";
};
*/

// https://github.com/mrdoob/three.js/issues/907


kiwoticum.ui.THREEjsRenderer = function(canvasContainer, builder) {

    var api = {};

    api.drawHexagon = function(hexagon, fillColor, strokeColor) {
    };

    api.drawCountry = function(country) {
    };

    return api;
};

