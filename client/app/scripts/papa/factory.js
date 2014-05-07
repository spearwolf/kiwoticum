(function(){
	var papa = require('./papa');

	papa.Module('Mixin', papa, function() {

		var mixins = {};

		var api = function(objectTypeName, callback) {
			if (!Array.isArray(mixins[objectTypeName])) {
				mixins[objectTypeName] = [];
			}
			mixins[objectTypeName].push(callback());
		};

		function _initialize(objectTypeName, apiInstance) {
			var exports;
			var instance = apiInstance;
			if (apiInstance.papa && apiInstance.papa.instance) {
				instance = apiInstance.papa.instance;
			}

			var _mixins = mixins[objectTypeName];
			if (Array.isArray(_mixins) && _mixins.length > 0) {

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

				_mixins.forEach(function(mixin) {
					if (typeof mixin === 'function') {
						mixin(instance, apiInstance);  //, instance);
					} else if (typeof mixin === 'object') {
						if (Array.isArray(mixin.dependsOn)) {
							mixin.dependsOn.forEach(function(_typeName) {
								api.Include(_typeName, apiInstance);
							});
						} else if (typeof mixin.dependsOn === 'string') {
							api.Include(mixin.dependsOn, apiInstance);
						}
						if (typeof mixin.initialize === 'function') {
							if (typeof mixin.namespace === 'string') {
								exports = papa.Module.CreateObjPath(mixin.namespace, apiInstance);
								mixin.initialize(instance, exports); //, instance);
							} else {
								mixin.initialize(instance, apiInstance); //, instance);
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

		api.NewObject = function(objectTypeName, newScopeInheritance, objInstance) {
			if (arguments.length === 1) {
				newScopeInheritance = true;
			} else if (arguments.length === 2 && typeof newScopeInheritance === 'object') {
				objInstance = newScopeInheritance;
				newScopeInheritance = true;
			}
			if (newScopeInheritance) {
				var apiInstance = objInstance || {};
				apiInstance.papa = {};

				var instance = Object.create(apiInstance);
				apiInstance.papa.instance = instance;
				apiInstance.papa.apiInstance = apiInstance;

				if (!!objectTypeName) {
					api.Include(objectTypeName, apiInstance);
				}

				return instance;

			} else {
				return api.Include(objectTypeName, (objInstance || {}));
			}
		};

		return api;
	});

})();
