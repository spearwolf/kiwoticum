/*global kiwoticum */
/*global iScroll */
/*global THREE */
/*global requestAnimationFrame */
jQuery(function($) {

    function createCountryMap(container) {
        var options = kiwoticum.builder.spw.getCountryMapBuilderConfig();

        //options.hexagonInlineOffset = 4.5;
        //options.hexagonInlineOffset2 = 2;
        //options.paddingX = 2;
        //options.paddingY = 2;

        var builder = kiwoticum.builder.CountryMapBuilder(options);
        //builder.renderer = kiwoticum.ui.SvgRenderer(container, builder);
        builder.renderer = kiwoticum.ui.THREEjsRenderer(container, builder);

        builder.createCountries();
        //builder.drawAll();

        return builder;
    }

    /*
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
    */

    _e.on("kiwoticum/ui/select/country", function(country) {
        console.log("country selected", country);
    });


    var container = $("[data-behavior=country-map-view]")[0];

    //createCountryMap(container);
    //createIScroll(container);
    //centerCountryMapView(container);

    //______________________ THREEjs setup ______________________________________________

    var camera, scene, renderer, mesh;

    /*
    function create_cube() {
        var geometry = new THREE.CubeGeometry( 200, 200, 200 )
          , material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } )
          , _mesh = new THREE.Mesh( geometry, material )
          ;
        return _mesh;
    }
    */

    function init() {
        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 500;
        camera.position.y = -250;
        //camera.rotation.y = 5;

        scene = new THREE.Scene();

        mesh = new THREE.Object3D();
        //mesh.add( create_cube() );

        var builder = createCountryMap(mesh);
        builder.drawAll();
        //console.log('builder:', builder);

        scene.add( mesh );

        mesh.position.x -= 525;
        mesh.position.y -= 400;
        mesh.position.z += 250;
        mesh.rotation.x = -1.1;

        // create a point light
        var pointLight = new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;

        // add to the scene
        scene.add(pointLight);



        //renderer = new THREE.CanvasRenderer();
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );

    }

    function animate() {

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame( animate );

        //mesh.rotation.x += 0.01;
        //mesh.rotation.y += 0.02;
        //mesh.rotation.z += 0.01;

        renderer.render( scene, camera );
    }

    init();
    animate();

});
