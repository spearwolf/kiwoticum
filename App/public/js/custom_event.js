// custom_event.js
// Created 2010/05/07 by Wolfger Schramm <wolfger@spearwolf.de>

var Cevent = (function () {

    function logError() {   // {{{
        if (typeof console !== 'undefined') {
            console.error.apply(window, arguments);
        }
    }
    // }}}

    var nextCallId = 1;

    function EventNode(name, parentNode) {
        this.name = name;
        this.parentNode = parentNode;
        this.children = [];
        this.greedyChildren = [];
        this.insatiableChildren = [];
        this.callbacks = [];
    }

    var rootNode = new EventNode();

    EventNode.prototype.fullPathName = function () {  // {{{
        return (typeof this.name === 'undefined') ? Cevent.pathSeparator : this._fullPathName();
    };

    EventNode.prototype._fullPathName = function () {
        return (typeof this.name === 'undefined') ? '' : this.parentNode._fullPathName() + Cevent.pathSeparator + this.name;
    };
    // }}}

    EventNode.prototype.addChild = function (name) {  // {{{
        var node = new EventNode(name, this);
        if (name === Cevent.greedyChar) {
            this.greedyChildren.push(node);
        } else if (name === Cevent.insatiableSequence) {
            this.insatiableChildren.push(node);
        } else {
            this.children.push(node);
        }
        return node;
    };
    // }}}

    EventNode.prototype.splitPath = function (path) {  // {{{
        var all_names = path.split(Cevent.pathSeparator),
            name = null;

        while (name === null || name.length === 0) {
            name = all_names.shift();
        }

        if (name === Cevent.insatiableSequence) {
            return [name, ''];
        }

        var rest = [];
        for (var i=0; i < all_names.length; i++) {
            rest.push(all_names[i]);
            if (all_names[i] === Cevent.insatiableSequence) {
                break;
            }
        }

        return [name, rest.length === 0 ? '' : rest.join(Cevent.pathSeparator)];
    };
    // }}}

    EventNode.prototype.matchNodes = function (path, fn) {  // {{{
        var split_path = this.splitPath(path),
            name = split_path[0],
            rest = split_path[1],
            child, i;

        if (rest.length > 0) {
            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                if (name === Cevent.greedyChar || name === child.name) {
                    child.matchNodes(rest, fn);
                }
            }
            for (i = 0; i < this.greedyChildren.length; i++) {
                this.greedyChildren[i].matchNodes(rest, fn);
            }
        } else {
            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                if (name === Cevent.greedyChar || name === child.name) {
                    fn(child);
                }
            }
            for (i = 0; i < this.greedyChildren.length; i++) {
                fn(this.greedyChildren[i]);
            }
        }
        for (i = 0; i < this.insatiableChildren.length; i++) {
            fn(this.insatiableChildren[i]);
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
            id: nextCallId++,
            fn: callbackFn
            // TODO unbind api
        };
        if (typeof options === 'object') {
            callback.once = !!options.once;
        }
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
        return rootNode.findOrCreateNode(eventPath).addCallback(callbackFn, options || {}).id;
        // TODO return unbind() api
    }

    function registerEventListenerOnce(eventPath, callbackFn) {
        return registerEventListener(eventPath, callbackFn, { once: true });
    }
    // }}}

    function fireEvent(eventName, fn) {  // {{{
        var args = [],
            results = [],
            i;

        for (i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        rootNode.matchNodes(eventName, function (node) {
            try {
                var destroy_callback_ids = [],

                    unbind = function(id) {
                        return function() {
                            destroy_callback_ids.push(id);
                        };
                    },

                    result,
                    callback;

                for (i = 0; i < node.callbacks.length; i++) {
                    callback = node.callbacks[i];

                    result = callback.fn.apply({ name: eventName, unbind: unbind(callback.id) }, args);

                    if (callback.once) {
                        destroy_callback_ids.push(callback.id);
                    }

                    if (result !== null && typeof result !== 'undefined') {
                        results.push(result);
                    }
                }

                node.destroyCallbacks(destroy_callback_ids);

            } catch (error) {
                logError(error);
            }
        });

        if (typeof fn === 'function' && results.length > 0) {
            fn.apply(window, results);
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

    return {
        on: registerEventListener,
        once: registerEventListenerOnce,
        emit: fireEvent,
        unbind: unbind,
        
        pathSeparator: '/',
        greedyChar: '*',
        insatiableSequence: '**',

        rootNode: rootNode  // just for debugging puprposes
    };
})();

