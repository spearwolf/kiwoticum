(function(){
	var papa = require('./papa');
    require('./factory');

	papa.Factory('events', function() {

		return function(api, self) {

			var callbacks = { _id: 0 };

			api.on = function(eventName, prio, fn) {

				if (arguments.length === 2) {
					fn = prio;
					prio = 0;
				}

				var eventListener = callbacks[eventName] || (callbacks[eventName] = [])
				  , fnId = ++callbacks._id
				  ;

				eventListener.push({ id: fnId, fn: fn, prio: (prio||0) });
				eventListener.sort(function(a,b){
					return b.prio - a.prio;
				});

				return fnId;
			};

			api.off = function(id) {
				var k, i, cb;
				for (k in callbacks) {
					if (callbacks.hasOwnProperty(k)) {
						for (i = 0; i < callbacks[k].length; i++) {
							cb = callbacks[k][i];
							if (cb.id === id) {
								callbacks[k].splice(i, 1);
								return;
							}
						}
					}
				}
			};

			api.emit = function(eventName /* arguments.. */) {
				var args = Array.prototype.slice.call(arguments, 1);
				if (eventName in callbacks) {
					callbacks[eventName].forEach(function(cb){
						cb.fn.apply(self, args);
					});
				}
			};

		};
	});
})();
