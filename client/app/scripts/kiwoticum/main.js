(function(){
    "use strict";

    require('./json/load.coffee');
    require('./world/create.coffee');

    papa.Module('kiwoticum', window, function(kiwoticum){

        kiwoticum.main = function() {

            kiwoticum.json.load('/api/v1/create').then(function(data) {

                var world = kiwoticum.world.create(data)

                console.log('world', world);
                console.log('region#0 centerPoint', world.regions[0].centerPoint);
                console.log('region#0', world.regions[0]);
            });
        };

    });
})();
// vim: et ts=4 sts=4 sw=4
