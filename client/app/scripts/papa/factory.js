(function(){
	var papa = require('./papa');

	papa.Module('Factory', function() {

		var factories = {};

		var api = function(objectTypeName, callback) {
			if (!Array.isArray(factories[objectTypeName])) {
				factories[objectTypeName] = [];
			}
			factories[objectTypeName].push(callback());
		};

		function _initialize(objectTypeName, apiInstance) {
			var exports;
			var instance = apiInstance;
			if (apiInstance.papa && apiInstance.papa.instance) {
				instance = apiInstance.papa.instance;
			}

			var _factories = factories[objectTypeName];
			if (Array.isArray(_factories) && _factories.length > 0) {

				if (!apiInstance.papa) {
					apiInstance.papa = {};
				}
				if (!apiInstance.papa.mixins) {
					apiInstance.papa.mixins = [objectTypeName];
				} else {
					if (apiInstance.papa.mixins.indexOf(objectTypeName) > -1) {
						return;
					}
					apiInstance.papa.mixins.push(objectTypeName);
				}

				_factories.forEach(function(factory) {
					if (typeof factory === 'function') {
						factory(apiInstance, instance);
					} else if (typeof factory === 'object') {
						if (Array.isArray(factory.dependsOn)) {
							factory.dependsOn.forEach(function(_typeName) {
								api.Include(_typeName, apiInstance);
							});
						} else if (typeof factory.dependsOn === 'string') {
							api.Include(factory.dependsOn, apiInstance);
						}
						if (typeof factory.initialize === 'function') {
							if (typeof factory.namespace === 'string') {
								exports = papa.Module.CreateObjPath(factory.namespace, apiInstance);
								factory.initialize(exports, instance);
							} else {
								factory.initialize(apiInstance, instance);
							}
						}
					}
				});
			}
		}

		api.Include = function(objectTypeName, instance) {
			if (Array.isArray(objectTypeName)) {
				objectTypeName.forEach(function(typeName) {
					_initialize(typeName, instance);
				});
			} else {
				_initialize(objectTypeName, instance);
			}
			return instance;
		};

		api.Create = function(objectTypeName, newScopeInheritance) {
			if (newScopeInheritance) {
				var apiInstance = { papa: {} };
				var instance = Object.create(apiInstance);
				apiInstance.papa.instance = instance;
				apiInstance.papa.apiInstance = apiInstance;
				api.Include(objectTypeName, apiInstance);
				return instance;
			} else {
				return api.Include(objectTypeName, {});
			}
		};

		return api;
	});

})();
