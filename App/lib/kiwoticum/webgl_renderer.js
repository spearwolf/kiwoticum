kiwoticum.WebGLRenderer = function(canvasContainer, builder) {
    try {
        // set the scene size
        var WIDTH = builder.getCanvasWidth(),
            HEIGHT = builder.getCanvasHeight();

        // set some camera attributes
        var VIEW_ANGLE = 45,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 0.1,
            FAR = 10000;

        // create a WebGL renderer, camera
        // and a scene
        var renderer = new THREE.WebGLRenderer();
        var camera = new THREE.Camera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        var scene = new THREE.Scene();

        // the camera starts at 0,0,0 so pull it back
        camera.position.z = 300;

        // start the renderer
        renderer.setSize(WIDTH, HEIGHT);

        // attach the render-supplied DOM element
        document.getElementById(canvasContainer).appendChild(renderer.domElement);

        // === test mesh ==========================================

        var geometry = new THREE.CubeGeometry(50, 50, 50);
        var material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

        var mesh = new THREE.Mesh(geometry, material);
        scene.addObject(mesh);


        return {
            beginRender: function() {
                renderer.render(scene, camera);
            },
            endRender: function() {
            },
            drawHexagon: function(hexagon, fillColor) {
            },
            drawCountry: function(country) {
            }
        };

    } catch (ex) {
        console.error("too bad :-(");
        console.error(ex);
    }
};
