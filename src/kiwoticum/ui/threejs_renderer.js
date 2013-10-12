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

    api.drawCountry = function(country) {
        //if (onlyFirstCountry) {
        //onlyFirstCountry = false;


        var shapePath, inlinePath;

        // country outline shape (polygon)
        shapePath = country.createShapePath();

        // inline shape
        inlinePath = country.data.inlineShapePath;

        console.log('shapePath', shapePath);
        console.log('inlinePath', inlinePath);

        // Step I) Create Path ________________________________

        var path = new THREE.Path();
        path.moveTo(shapePath[0][0], shapePath[0][1]);
        for (var i=1; i < shapePath.length; i++) {
            path.lineTo(shapePath[i][0], shapePath[i][1]);
        }

        var shapes = path.toShapes();
        var solid = new THREE.ExtrudeGeometry(shapes, {
            amount: 2,
            bevelEnabled: false
        });

        //console.log('THREE.Path:', path);
        //console.log('shapes:', shapes);
        //console.log('solid:', solid);

        //var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
        //var material = new THREE.MeshBasicMaterial({
        var material = new THREE.MeshLambertMaterial({
            color: country.data.color
        });
        var mesh = new THREE.Mesh(solid, material);

        //console.log('mesh:', mesh);

        scene.add( mesh );
        //}
    };

    //api.endRender = function(){}

    return api;
};

