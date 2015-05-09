function Widget() {
}
Widget.prototype = {
    constructor: Widget,
    el: null,
    setup: false,
    _init: function (opt) {
        opt = opt || {}
        var el = opt.el;
        if (el == undefined) {
            this.setup = true;
        } else {
            if (typeof(el) == 'string') {
                this.elStr = el;
                this.el = this.$(el);
            } else if (el.nodeType) {
                this.el = el;
            }
        }
        if (this.opt) {
            for (var i in this.opt) {
                this[i] = opt[i] || this.opt[i];
            }
        }
    }
};
mix(Widget.prototype,common);
