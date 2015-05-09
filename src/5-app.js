function APP() {
};
APP.prototype = {
    constructor: APP,
    ajaxConfig: {
        jsonError: function () {
            alert('Server json format error');
        },
        timeoutCb: function () {
            alert('Server response timeout');
        },
        timeout: false,
        beforeResponse: null,
        afterResponse: null
    },
    _init: function () {
        for (var i in this.el) {
            this[i] = this.$(this.el[i]);
        }
        for (var i in this.els) {
            this[i] = this.$$(this.els[i]);
        }
        for (var i in this.tpl) {
            this.tpl[i] = this.$(this.tpl[i]).innerHTML;
        }
        for (var i in this.superclass.ajaxConfig) {
            this.ajaxConfig[i] = this.ajaxConfig[i] || this.superclass.ajaxConfig[i];
        }
    }
};
mix(APP.prototype,common);
