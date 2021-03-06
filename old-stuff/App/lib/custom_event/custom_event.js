// custom_event.js
// Created 2010/05/07 by Wolfger Schramm <wolfger@spearwolf.de>
(function() {

    var root = this, _E = { VERSION: "0.6.3" };

    // Export the API object for **CommonJS**, with backwards-compatibility
    // for the old `require()` API. If we're not in CommonJS, add `_E` to the
    // global object.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = _E;
    } else {
        root._E = _E;
    }

    function logError() {   // {{{
        if (typeof root.console !== 'undefined') {
            console.error(Array.prototype.slice.call(arguments).join(" "));
        }
    }
    // }}}

    function EventNode(name, parentNode) {  // {{{
        this.name = name;
        this.parentNode = parentNode;
        this.children = [];
        this.greedyChildren = [];
        this.insatiableChildren = [];
        this.callbacks = [];
    }
    // }}}

    var rootNode = new EventNode(), nextCallbackId = 1;

    EventNode.prototype.fullPathName = function () {  // {{{
        return (typeof this.name === 'undefined') ? _E.options.pathSeparator : this._fullPathName();
    };

    EventNode.prototype._fullPathName = function () {
        return (typeof this.name === 'undefined') ? '' : this.parentNode._fullPathName() + _E.options.pathSeparator + this.name;
    };
    // }}}

    EventNode.prototype.addChild = function (name) {  // {{{
        var node = new EventNode(name, this);
        if (name === _E.options.greedyChar) {
            this.greedyChildren.push(node);
        } else if (name === _E.options.insatiableSequence) {
            this.insatiableChildren.push(node);
        } else {
            this.children.push(node);
        }
        return node;
    };
    // }}}

    EventNode.prototype.splitPath = function (path) {  // {{{
        var all_names = path.split(_E.options.pathSeparator),
            name = null;

        while (name === null || name.length === 0) {
            name = all_names.shift();
        }

        if (name === _E.options.insatiableSequence) {
            return [name, ''];
        }

        var rest = [];
        for (var i=0; i < all_names.length; i++) {
            rest.push(all_names[i]);
            if (all_names[i] === _E.options.insatiableSequence) {
                break;
            }
        }

        return [name, rest.length === 0 ? '' : rest.join(_E.options.pathSeparator)];
    };
    // }}}

    EventNode.prototype.matchNodes = function (path, fn) {  // {{{
        var split_path = this.splitPath(path),
            name = split_path[0],
            rest = split_path[1],
            child, i;

        for (i = 0; i < this.insatiableChildren.length; i++) {
            fn(this.insatiableChildren[i]);
        }
        if (rest.length > 0) {
            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                if (name === _E.options.greedyChar || name === child.name) {
                    child.matchNodes(rest, fn);
                }
            }
            for (i = 0; i < this.greedyChildren.length; i++) {
                this.greedyChildren[i].matchNodes(rest, fn);
            }
        } else {
            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                if (name === _E.options.greedyChar || name === child.name) {
                    fn(child);
                }
            }
            for (i = 0; i < this.greedyChildren.length; i++) {
                fn(this.greedyChildren[i]);
            }
        }
    };
    // }}}

    EventNode.prototype.findOrCreateNode = function (path) {  // {{{
        var split_path = this.splitPath(path),
            name = split_path[0],
            rest = split_path[1];

        var findChild = (function (self) {
            return function (childName) {
                var i, child;
                for (i = 0; i < self.children.length; i++) {
                    child = self.children[i];
                    if (childName === child.name) {
                        return child;
                    }
                }
                for (i = 0; i < self.greedyChildren.length; i++) {
                    child = self.greedyChildren[i];
                    if (childName === child.name) {
                        return child;
                    }
                }
                return null;
            };
        })(this);
        var node = findChild(name);

        if (node === null) {
            node = this.addChild(name);
        }

        if (rest.length > 0) {
            return node.findOrCreateNode(rest);
        } else {
            return node;
        }
    };
    // }}}

    EventNode.prototype.addCallback = function (callbackFn, options) {  // {{{
        var callback = {
            id: nextCallbackId++,
            name: options.name,
            fn: callbackFn,
            once: !!options.once,
            binding: options.binding,
            paused: false
        };
        this.callbacks.push(callback);
        return callback;
    };
    // }}}

    EventNode.prototype.destroyCallbacks = function (ids) {  // {{{
        var updated_callbacks = [], i, j, skip, count = 0;
        for (i = 0; i < this.callbacks.length; i++) {
            skip = false;
            for (j = 0; j < ids.length; j++) {
                if (this.callbacks[i].id == ids[j]) {
                    skip = true;
                    ++count;
                    break;
                }
            }
            if (!skip) {
                updated_callbacks.push(this.callbacks[i]);
            }
        }
        this.callbacks = updated_callbacks;
        return count;
    };
    // }}}

    function registerEventListener(eventPath, callbackFn, options) {  // {{{
        var opts = options || {};
        opts.name = eventPath;
        var listener = rootNode.findOrCreateNode(eventPath).addCallback(callbackFn, opts);
        return {
            id: listener.id,
            name: listener.name,
            unbind: function() { _E.unbind(listener.id); },
            emit: function() { _E.emit.apply(root, [listener.name].concat(Array.prototype.slice.call(arguments))); },
            pause: function(pause) { 
                if (typeof pause === 'boolean') {
                    listener.paused = pause;
                }
                return listener.paused;
            }
        };
    }
    // }}}

    function registerEventListenerOnce(eventPath, callbackFn, options) {  // {{{
        var opts = options || {};
        opts.once = true;
        return registerEventListener(eventPath, callbackFn, opts);
    }
    // }}}

    function createEmitStackTrace() {  // {{{
        if (typeof _E._emitStackTrace !== 'object') {
            _E._emitStackTrace = { currentLevel: 1 };
        } else {
            ++_E._emitStackTrace.currentLevel;
        }
        return _E._emitStackTrace;
    }
    // }}}

    function clearEmitStackTrace() {  // {{{
        --_E._emitStackTrace.currentLevel;
        if (_E._emitStackTrace.currentLevel === 0) {
            _E._emitStackTrace = { currentLevel: 0 };
        }
    }
    // }}}

    function emitEvent(eventName) {  // {{{
        var args = [],
            results = [],
            result_fn,
            i, len;

        for (i = 1, len = arguments.length; i < len; ++i) {
            if (i === len - 1 && typeof arguments[i] === 'function') {
                result_fn = arguments[i];
            } else {
                args.push(arguments[i]);
            }
        }

        var stacktrace = createEmitStackTrace();

        rootNode.matchNodes(eventName, function (node) {
            try {
                var destroy_callback_ids = [], call_count,

                    unbind = function(id) {
                        return function() {
                            destroy_callback_ids.push(id);
                        };
                    },

                    pause = function(callback) {
                        return function() {
                            callback.paused = true;
                        };
                    },

                    result,
                    context,
                    callback;

                for (i = 0; i < node.callbacks.length; i++) {
                    callback = node.callbacks[i];

                    if (callback.paused) {
                        continue;
                    }

                    if (!(callback.id in _E._emitStackTrace)) {
                        stacktrace[callback.id] = 1;

                        context = callback.binding || {};
                        context.name = eventName;
                        context.unbind = unbind(callback.id);
                        if (typeof context.pause !== 'function') {  // don't overwrite _E.Module's pause()
                            context.pause = pause(callback);
                        }

                        result = callback.fn.apply(context, args);

                        if (callback.once) {
                            destroy_callback_ids.push(callback.id);
                        }

                        if (result !== null && typeof result !== 'undefined') {
                            results.push(result);
                        }
                    }
                }

                node.destroyCallbacks(destroy_callback_ids);

            } catch (error) {
                logError(error);
            }
        });

        clearEmitStackTrace();

        if (result_fn && results.length > 0) {
            result_fn.apply(root, results);
        }
    }
    // }}}

    function unbind(pathOrId, node) {  // {{{
        node = node || rootNode;

        if (typeof pathOrId === 'number') {
            if (node.destroyCallbacks([pathOrId]) > 0) {
                return true;
            } else {
                var i;
                for (i = 0; i < node.children.length; i++) {
                    if (unbind(pathOrId, node.children[i])) {
                        return true;
                    }
                }
                for (i = 0; i < node.greedyChildren.length; i++) {
                    if (unbind(pathOrId, node.greedyChildren[i])) {
                        return true;
                    }
                }
                for (i = 0; i < node.insatiableChildren.length; i++) {
                    if (unbind(pathOrId, node.insatiableChildren[i])) {
                        return true;
                    }
                }
                return false;
            }
        }
    }
    // }}}

    function connectEventListener() {  // {{{
        var listener = Array.prototype.slice.call(arguments),
            action = listener.shift();
        return _E.on(action, function() {
            var args = Array.prototype.slice.call(arguments);
            for (var j = 0; j < listener.length; ++j) {
                _E.emit.apply(this, [listener[j]].concat(args));
            }
        });
    }
    // }}}

    function createModule(rootPath, module) {  // {{{
        rootPath = rootPath.replace(/\/+$/, '');
        var listener = [], sub_modules = [], annotation;

        if (_E.options.debug) { console.group("_E.Module ->", rootPath); }

        if ("_init" in module) {
            if (_E.options.debug) { console.log("constructor", rootPath); }
            listener.push(_E.once(rootPath+"/"+_E.options.insatiableSequence, module._init, { binding: module }));
        }
        for (var prop in module) {
            if (module.hasOwnProperty(prop)) {
                annotation = prop.match(/^(on|module) (.+)$/);
                if (annotation) {
                    if (annotation[1] === 'on' && typeof module[prop] === 'function') {
                        if (prop !== '_init') {
                            if (_E.options.debug) { console.log("on", rootPath+"/"+annotation[2]); }
                            listener.push(_E.on(rootPath+"/"+annotation[2], module[prop], { binding: module }));
                        }
                    }
                    if (annotation[1] === 'module' && typeof module[prop] === 'object') {
                        sub_modules.push(createModule(rootPath+"/"+annotation[2], module[prop]));
                    }
                }
            }
        }
        if (_E.options.debug) { console.groupEnd(); }

        module.destroy = function() {
            var i;
            for (i= 0; i < listener.length; ++i) {
                listener[i].unbind();
            }
            for (i= 0; i < sub_modules.length; ++i) {
                sub_modules[i].destroy();
            }
        };

        var paused = false;
        module.pause = function(pause) {
            if (typeof pause === 'boolean') {
                paused = pause;
                var i;
                for (i= 0; i < listener.length; ++i) {
                    listener[i].pause(pause);
                }
                for (i= 0; i < sub_modules.length; ++i) {
                    sub_modules[i].pause(pause);
                }
            }
            return paused;
        };

        return module;
    }
    // }}}

    // custom event API
    _E.on = registerEventListener;
    _E.once = registerEventListenerOnce;
    _E.emit = emitEvent;
    _E.connect = connectEventListener;  // TODO connect groups API
    _E.unbind = unbind;
    
    // module API
    _E.Module = createModule;

    // options
    _E.options = {
        pathSeparator: '/',
        greedyChar: '*',
        insatiableSequence: '**',
        debug: false
    };

    // debug
    _E._rootNode = rootNode;
})();
