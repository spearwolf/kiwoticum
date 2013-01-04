(function() {
    var kiwoticum = {};
    var root = this;
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = kiwoticum;
        }
        exports.kiwoticum = kiwoticum;
    }
    root.kiwoticum = kiwoticum;
})();
