(function(){
    "use strict";

    require('./json/load.coffee');
    require('./world/create.coffee');
    require('./app/fullscreen_canvas.coffee');
    require('./app/world_viewer.coffee');

    papa.Module('kiwoticum', function(kiwoticum) {

        kiwoticum.main = function() {

            var app = papa.Mixin.NewObject("kiwoticum.app.world_viewer", true);

            kiwoticum.app.fullscreen_canvas.create(app);

            kiwoticum.json.load('/api/v1/create').then(function(data) {

                var world = kiwoticum.world.create(data);
                app.setWorld(world);

                console.log('world', world);
                console.log('region#0', world.regions[0]);
            });
        };

    });
})();

// vim: et ts=4 sts=4 sw=4
