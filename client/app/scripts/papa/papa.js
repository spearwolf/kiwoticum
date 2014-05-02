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
