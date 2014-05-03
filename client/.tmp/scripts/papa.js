!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.papa=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function(){
	"use strict";

	module.exports = _dereq_('./papa/papa');
    _dereq_('./papa/factory');
    _dereq_('./papa/events');
    _dereq_('./papa/app');

})();

},{"./papa/app":2,"./papa/events":5,"./papa/factory":6,"./papa/papa":7}],2:[function(_dereq_,module,exports){
(function(){

	var papa = _dereq_('./papa');
    _dereq_('./factory');
    _dereq_('./app_state_machine.coffee');

	papa.Module('App', function() {

		var apps = {};
		var nextAppId = 0;

		function generateAppName() {
			return 'app' + nextAppId++;
		}

		function createAppSkeleton(name) {
			var app = papa.Factory.Create([
					//"events",
					"app_state_machine"
				], true);
			app.papa.name = name;
			return app;
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

},{"./app_state_machine.coffee":3,"./factory":6,"./papa":7}],3:[function(_dereq_,module,exports){
var papa, state_machine;

papa = _dereq_('./papa');

_dereq_('./factory');

_dereq_('./events');

state_machine = _dereq_('./coffee_state_machine').state_machine;

papa.Factory("app_state_machine", function() {
  return {
    namespace: 'state',
    dependsOn: 'events',
    initialize: function(exports, self) {
      return state_machine("state", {
        extend: exports
      }, function(state, event, transition) {
        state.initial("created");
        state("setup", {
          parent: "initialize"
        });
        state("loading", {
          parent: "initialize"
        });
        state("postInit", {
          parent: "initialize"
        });
        state("running", {
          parent: "ready"
        });
        state("paused", {
          parent: "ready"
        });
        event("start", function() {
          transition.from("created", {
            to: "setup"
          }, function() {
            return self.emit("setup");
          });
          return transition.from("postInit", {
            to: "running"
          }, function() {
            return self.emit("started");
          });
        });
        event("loadAssets", function() {
          return transition.from("setup", {
            to: "loading"
          });
        });
        return event("assetsLoaded", function() {
          return transition.from("loading", {
            to: "postInit"
          }, function() {
            self.emit("assetsLoaded");
            return exports.start();
          });
        });
      });
    }
  };
});


},{"./coffee_state_machine":4,"./events":5,"./factory":6,"./papa":7}],4:[function(_dereq_,module,exports){
/*! coffee_state_machine 2013-09-11 */
/*! created 2012-13 by Wolfger Schramm <wolfger@spearwolf.de> */
/*! https://github.com/spearwolf/coffee_state_machine */
(function(){var a,b,c=[].slice,d={}.hasOwnProperty;b=function(a,b,e){var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K;for("function"==typeof b&&"undefined"==typeof e&&(J=[b,{}],e=J[0],b=J[1]),B="function"==typeof b["class"]?new b["class"]:null!=(K=b.extend)?K:{},g={},F={},l=function(a,b){var c;return c=g[a]||(g[a]={state:a}),null!=b&&(c.parent=b),c},f=function(a,b,c){var d,e,f,g,h;for("string"==typeof b&&(b=[b]),h=[],f=0,g=b.length;g>f;f++)d=b[f],e=F[d]||(F[d]={}),e[a]||(e[a]=[]),h.push(e[a].push(c));return h},E=function(a,b,c){var d,e;return null==b&&(b={}),"function"==typeof b&&(e=[b,{}],c=e[0],b=e[1]),d=l(a,b.parent),"function"==typeof c&&(d.properties=c.call(B)),null!=b.parent&&l(b.parent),null!=b.enter&&f("enter",a,b.enter),null!=b.exit?f("exit",a,b.exit):void 0},E.initial=function(b,c,d){return null==c&&(c={}),E(b,c,d),B[a]=b},E.type="coffee_state_machine.StateHelperFunction",B.is_valid_state=function(a){return null!=g[a]&&g[a].state===a},m=function(a){return function(){var b,d,e;return d=2<=arguments.length?c.call(arguments,0,e=arguments.length-1):(e=0,[]),b=arguments[e++],f(a,d,b)}},E.enter=m("enter"),E.exit=m("exit"),C={},w=function(a){var b;return null!=(b=g[a])?b.parent:void 0},x=function(a){var b;return(b=null!=g[a])?b.parents||(b.parents=function(){var b;for(b=[];a=w(a);)b.push(a);return b}().reverse()):[]},B.get_parent_states=function(a){return x(a)},B.is_state=function(b){var c;return c=B[a],c===b||x(c).indexOf(b)>=0},v=function(a,b){var c,d,e;for(e=x(a),c=0,d=e.length;d>c;c++)a=e[c],b(a)},i=function(a,b){var c,d,f,g,h;for(c=(null!=(g=F[a])?g[b]:void 0)||[],h=[],d=0,f=c.length;f>d;d++)e=c[d],h.push(e.call(B));return h},t=function(a){var b,c,e;for(b in a)d.call(a,b)&&(c=a[b],e=[B[b],c],C[b]=e[0],B[b]=e[1])},u=function(a,b){var c,e;for(c in a)d.call(a,c)&&(e=a[c],b[c]=e)},D=function(b,c){var e,f,h,j,k,l,m,n,o,p,q;for(null==c&&(c=B[a]),h={old:x(c),next:x(b)},h.exit=function(){var a,b,c,d;for(c=h.old,d=[],a=0,b=c.length;b>a;a++)j=c[a],-1===h.next.indexOf(j)&&d.push(j);return d}(),h.enter=function(){var a,b,c,d;for(c=h.next,d=[],a=0,b=c.length;b>a;a++)j=c[a],-1===h.old.indexOf(j)&&d.push(j);return d}(),p=h.exit,l=0,n=p.length;n>l;l++)j=p[l],j!==b&&i(j,"exit");null!=c&&b!==c&&-1===h.next.indexOf(c)&&i(c,"exit"),B[a]=b;for(e in C)d.call(C,e)&&(k=C[e],B[e]=k);for(f={},v(b,function(a){return u(g[a].properties,f)}),u(g[b].properties,f),t(f),q=h.enter,m=0,o=q.length;o>m;m++)j=q[m],j!==c&&i(j,"enter");return c!==!1&&b===c||-1!==h.old.indexOf(b)?void 0:i(b,"enter")},h=function(a,b,c,d){return"function"==typeof b&&(a["if"]=b),"function"==typeof c&&(a.unless=c),"function"==typeof d&&(a.action=d),a},n=function(a,b,c,d,e){var f;return f={from:a,to:b},h(f,c,d,e)},A=function(a){return null!=a?"string"==typeof a?[a]:a:[]},k=function(a,b,c,d,e,f){var g;return g={to:a,except:A(b),only:A(c),is_valid:function(a){return null!=a?(!this.toState||this.toState===a)&&(0===this.except.length||this.except.indexOf(a)<0)&&(0===this.only.length||this.only.indexOf(a)>=0):void 0}},h(g,d,e,f)},r=function(){var a;return(a=B[q]).transitions||(a.transitions={})},p=function(){var a;return(a=B[q]).all_transitions||(a.all_transitions=[])},o=function(a,b){var c,d,e,f;e=r(),f=[];for(c in a)d=a[c],f.push(e[c]=n(c,d,void 0,void 0,b));return f},G=function(){var a;return a=1<=arguments.length?c.call(arguments,0):[],"undefined"!=typeof q&&null!==q&&"object"==typeof a[0]?o(a[0],a[1]):void 0},G.from=function(a,b,c){var d,e,f,g,h,i;if("undefined"!=typeof q&&null!==q){for(e=r(),i="string"==typeof a?[a]:a,h=[],f=0,g=i.length;g>f;f++)d=i[f],h.push(e[d]=n(d,b.to,b["if"],b.unless,c||b.action));return h}},G.all=function(a,b){var c;return null==a&&(a={}),null==b&&(b=void 0),"undefined"!=typeof q&&null!==q?(c=p(),c.push(k(a.to,a.except,a.only,a["if"],a.unless,b||a.action))):void 0},G.type="coffee_state_machine.TransitionHelperFunction",z=[],q=null,j=function(a){return!(null!=a["if"]&&!a["if"].call(B)||null!=a.unless&&a.unless.call(B))},s=function(b,d){var e,f;return e=B[b]||(B[b]=function(){var b,d,f,g,h,i,k,l,m,n,o,p,q,r,s,t,u,v;if(d=1<=arguments.length?c.call(arguments,0):[],f=B[a],l=(e.transitions||(e.transitions={}))[f],null==l||j(l)||(l=null),null==l)for(u=e.all_transitions||(e.all_transitions=[]),o=0,r=u.length;r>o;o++)if(b=u[o],b.is_valid(f)&&j(b)){l=b;break}if(null!=l){for(h=f,D(l.to),f=B[a],m=[],v=x(h),p=0,s=v.length;s>p;p++)i=v[p],k=e.transitions[i],null!=k&&null!=k.action&&(k.to===f||-1!==x(f).indexOf(k.to))&&m.push(k.action);for(null!=l.action&&m.push(l.action),n=[],q=0,t=m.length;t>q;q++)g=m[q],-1===n.indexOf(g)&&(g.apply(B,[h].concat(d)),n.push(g));return!0}return!1}),"function"==typeof d&&(q=b,d.call(B),q=null),f={transition:function(){var a;return a=1<=arguments.length?c.call(arguments,0):[],z.push({fn:G,event:b,args:a}),f}},f.transition.from=function(){var a;return a=1<=arguments.length?c.call(arguments,0):[],z.push({fn:G.from,event:b,args:a}),f},f.transition.all=function(){var a;return a=1<=arguments.length?c.call(arguments,0):[],z.push({fn:G.all,event:b,args:a}),f},f},s.type="coffee_state_machine.EventHelperFunction",e.call(B,E,s,G),H=0,I=z.length;I>H;H++)y=z[H],q=y.event,y.fn.apply(this,y.args);return q=null,B[a]||(B[a]=b.initial),E(B[a]),D(B[a],!1),B},"function"==typeof define&&define.amd?define("state_machine",function(){return b}):(a="undefined"!=typeof exports&&null!==exports?exports:this,a.state_machine=b)}).call(this);
},{}],5:[function(_dereq_,module,exports){
(function(){
	var papa = _dereq_('./papa');
    _dereq_('./factory');

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

},{"./factory":6,"./papa":7}],6:[function(_dereq_,module,exports){
(function(){
	var papa = _dereq_('./papa');

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

		api.Create = function(objectTypeName, newScopeInheritance, objInstance) {
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

},{"./papa":7}],7:[function(_dereq_,module,exports){
(function(papa){
    "use strict";

    papa.Module = function(name, root, createModFn) {
        if (arguments.length === 2) {
            createModFn = root;
            root = papa;
        }
        papa.Module.CreateObjPath(name, root, function(cur, next) {
            if (typeof createModFn === 'function') {
                if (typeof cur[next] === 'undefined') {
                    cur[next] = {};
                }
                var res = createModFn(cur[next]);
                if (typeof res !== 'undefined') {
                    cur[next] = res;
                }
            } else {
                if (typeof cur[next] === 'undefined') {
                    cur[next] = createModFn;
                } else {
                    throw new Error("could not override object path: " + name);
                }
            }
        });
    };

    papa.Module.CreateObjPath = function(name, root, nextCallback) {
        var path = name.split('.');
        var cur = root;
        var i, next;
        for (i = 0; i < path.length - 1; i++) {
            next = path[i];
            if (typeof cur[next] === 'undefined') {
                cur[next] = {};
            }
            cur = cur[next];
        }
        next = path[path.length-1];
        if (typeof nextCallback === 'function') {
            nextCallback(cur, next);
        } else {
            if (typeof cur[next] === 'undefined') {
                cur[next] = {};
            }
            return cur[next];
        }
    };

})(module.exports);
// vim: et ts=4 sts=4 sw=4

},{}]},{},[1])
(1)
});