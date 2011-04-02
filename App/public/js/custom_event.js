// custom_event.js
// Created 2010/05/07 by Wolfger Schramm <wolfger@spearwolf.de>

var $CE = (function () {

    function EventNode(name, parentNode) {
        this.name = name;
        this.parentNode = parentNode;
        this.children = [];
        this.greedyChildren = [];
        this.callbacks = [];
    }

    var rootNode = new EventNode();

    EventNode.prototype.fullPathName = function () {
        return (typeof this.name === 'undefined') ? '/' : this._fullPathName();
    };

    EventNode.prototype._fullPathName = function () {
        return (typeof this.name === 'undefined') ? '' : this.parentNode._fullPathName() + '/' + this.name;
    };

    EventNode.prototype.addChild = function (name) {
        var node = new EventNode(name, this);
        if (name === '*') {
            this.greedyChildren.push(node);
        } else {
            this.children.push(node);
        }
        return node;
    };

    EventNode.prototype.splitPath = function (path) {
        var all_names = path.split('/');
        var name = all_names.shift();

        while (name.length === 0) {
            name = all_names.shift();
        }

        var rest = (all_names.length === 0) ? '' : all_names.join('/');
        return [name, rest];
    };

    EventNode.prototype.matchNodes = function (path, fn) {
        var split_path = this.splitPath(path);
        var name = split_path[0];
        var rest = split_path[1];
        var i, child;

        if (rest.length > 0) {
            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                if (name === "*" || name === child.name) {
                    child.matchNodes(rest, fn);
                }
            }
            for (i = 0; i < this.greedyChildren.length; i++) {
                this.greedyChildren[i].matchNodes(rest, fn);
            }
        } else {
            for (i = 0; i < this.children.length; i++) {
                child = this.children[i];
                if (name === "*" || name === child.name) {
                    fn(child);
                }
            }
            for (i = 0; i < this.greedyChildren.length; i++) {
                fn(this.greedyChildren[i]);
            }
        }
    };

    EventNode.prototype.findOrCreateNode = function (path) {
        var split_path = this.splitPath(path);
        var name = split_path[0];
        var rest = split_path[1];

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

    function registerEventListener(eventPath, callbackFn) {
        rootNode.findOrCreateNode(eventPath).callbacks.push(callbackFn);
    }

    function logError() {
        if (console !== undefined) {
            console.error.apply(window, arguments);
        }
    }

    function fireEvent(eventName, fn) {
        var args = [];
        var results = [];
        var i;
        for (i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        rootNode.matchNodes(eventName, function (node) {
            try {
                for (i = 0; i < node.callbacks.length; i++) {
                    var result = node.callbacks[i].apply({ name: eventName }, args);
                    if (result !== null && result !== undefined) {
                        results.push(result);
                    }
                }
            } catch (error) {
                logError(error);
            }
        });

        if (typeof fn === 'function' && results.length > 0) {
            fn.apply(window, results);
        }
    }

    return {
        bind: registerEventListener,
        fire: fireEvent
    };
})();

