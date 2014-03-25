/*global kiwoticum */
/*global THREE */
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


kiwoticum.ui.THREEjsRenderer = function(scene, builder) {

    var api = {};

    //api.beginRender = function() {
    //};

    api.drawHexagon = function(hexagon, fillColor, strokeColor) {
    };


    function createMesh(points, amount, color) {

        // Path _____________________________________________________

        var path = new THREE.Path();
        path.moveTo(points[0][0], points[0][1]);
        for (var i=1; i < points.length; i++) {
            path.lineTo(points[i][0], points[i][1]);
        }

        // Geometry _________________________________________________

        var shapes = path.toShapes();
        var solid = new THREE.ExtrudeGeometry(shapes, {
            amount: amount,
            bevelEnabled: false
        });

        // Material _________________________________________________

        var material = new THREE.MeshLambertMaterial({
            color: color
        });

        // Mesh _____________________________________________________

        return new THREE.Mesh(solid, material);
    }

    api.drawCountry = function(country) {

        var shapePath = country.createShapePath()        // country outline shape (polygon)
          , inlinePath = country.data.inlineShapePath;   // inline shape

        scene.add( createMesh(shapePath, 2, country.data.color) );
        scene.add( createMesh(inlinePath, 3, '#333333') );
    };

    //api.endRender = function(){}

    return api;
};

