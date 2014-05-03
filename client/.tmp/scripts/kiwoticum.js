(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
    "use strict";

    require('./kiwoticum/main');

    kiwoticum.main();

})();
// vim: et ts=4 sts=4 sw=4

},{"./kiwoticum/main":3}],2:[function(require,module,exports){
papa.Module("kiwoticum.json", window, function(exports) {
  exports.load = function(url) {
    var deferred, req;
    deferred = Q.defer();
    req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function() {
      if (req.status >= 200 && req.status < 400) {
        return deferred.resolve(JSON.parse(req.responseText));
      } else {
        return console.log('ERROR', req);
      }
    };
    req.onerror = function() {
      return console.log('ERROR', req);
    };
    req.send();
    return deferred.promise;
  };
});


},{}],3:[function(require,module,exports){
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

},{"./json/load.coffee":2,"./world/create.coffee":4}],4:[function(require,module,exports){
require("./setup.coffee");

papa.Module("kiwoticum.world", window, function(exports) {
  exports.create = function(data) {
    return papa.Factory.Create("kiwoticum.world", true, {
      data: data
    });
  };
});


},{"./setup.coffee":8}],5:[function(require,module,exports){
var findMax, findMin;

require("./region.coffee");

findMin = function(key, path) {
  var min, v, _i, _len;
  min = null;
  for (_i = 0, _len = path.length; _i < _len; _i++) {
    v = path[_i];
    if (min === null || v[key] < min) {
      min = v[key];
    }
  }
  return min;
};

findMax = function(key, path) {
  var max, v, _i, _len;
  max = null;
  for (_i = 0, _len = path.length; _i < _len; _i++) {
    v = path[_i];
    if (max === null || v[key] > max) {
      max = v[key];
    }
  }
  return max;
};

papa.Factory("kiwoticum.world.region.bbox", function() {
  return {
    dependsOn: "kiwoticum.world.region",
    initialize: function(exports, self) {
      self.bbox = {
        x0: findMin('x', self.path.full),
        y0: findMin('y', self.path.full),
        x1: findMax('x', self.path.full),
        y1: findMax('y', self.path.full)
      };
      self.bbox.w = self.bbox.x1 - self.bbox.x0;
      return self.bbox.h = self.bbox.y1 - self.bbox.y0;
    }
  };
});


},{"./region.coffee":7}],6:[function(require,module,exports){
require("./region.coffee");

require("./bbox.coffee");

papa.Module("kiwoticum.world.region", window, function(exports) {
  exports.create = function(world, id) {
    return papa.Factory.Create(['kiwoticum.world.region', 'kiwoticum.world.region.bbox'], true, {
      world: world,
      id: id
    });
  };
});


},{"./bbox.coffee":5,"./region.coffee":7}],7:[function(require,module,exports){
papa.Factory("kiwoticum.world.region", function() {
  return {
    initialize: function(exports, self) {
      self.centerPoint = self.world.data.centerPoints[self.id];
      return self.path = {
        base: self.world.data.regions[self.id].basePath,
        full: self.world.data.regions[self.id].fullPath
      };
    }
  };
});


},{}],8:[function(require,module,exports){
require("./region/create.coffee");

papa.Factory("kiwoticum.world", function() {
  return {
    initialize: function(exports, self) {
      var createRegion, i;
      createRegion = function(id) {
        return kiwoticum.world.region.create(self, id);
      };
      return self.regions = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = self.data.regions.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(createRegion(i));
        }
        return _results;
      })();
    }
  };
});


},{"./region/create.coffee":6}]},{},[1,3,2,4,5,6,7,8])