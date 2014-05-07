(function(){

	var papa = require('./papa');
    require('./factory');
    require('./app_state_machine.coffee');

	papa.Module('App', papa, function() {

		var apps = {};
		var nextAppId = 0;

		function generateAppName() {
			return 'app' + nextAppId++;
		}

		function createAppSkeleton(name) {
			return papa.Mixin.NewObject([
					"app_state_machine"
				], {
					name: name
				});
			// app.papa.name = name;
			// return app;
		}

		var api = function(name, callback) {

			if (arguments.length === 1) {
				if (typeof arguments[0] === 'string') {
					return apps[name];
				} else {
					callback = name;
					name = generateAppName();
				}
			}

			var app = createAppSkeleton(name);
			apps[name] = app;

			callback(app);

			return app;
		};

		return api;
	});

})();
