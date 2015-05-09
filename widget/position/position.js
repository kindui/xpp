X.add({
    name: 'Position',
    single: true,
    opt: {
        el: null,
        baseEl: null,
        top: 0,
        left: 0
    },
    _init: function () {
        //
        this.position = this.position.bind(this);
    },
    position: function (opt) {

        this.mix(this, opt);
        this.el = this.$(this.el);
        this.baseEl = this.$(this.baseEl);

        if (typeof(this.baseEl) == 'string') {
            this.baseEl = this.$(this.baseEl);
        }
        if (this.el.parentNode.nodeType != 9) {
            var deTouch = this.el.parentNode.removeChild(this.el);
            document.body.appendChild(deTouch);
        }
        this.compute();
        this.renderTo();
    },
    compute: function () {
        var b = this.baseEl.getBoundingClientRect();
        this.baseElPos = {
            docTop: b.top + document.body.scrollTop,
            docLeft: b.left + document.body.scrollLeft
        }
    },
    renderTo: function () {
        this.css('position', 'absolute');
        if (String(this.left).indexOf('%') != -1) {
            this.left = this.baseEl.offsetWidth * parseInt(this.left) / 100;
        }
        if (String(this.top).indexOf('%') != -1) {
            this.top = this.baseEl.offsetHeight * parseInt(this.top) / 100;
        }

        this.css('left', this.baseElPos.docLeft + parseInt(this.left) + 'px');
        this.css('top', this.baseElPos.docTop + parseInt(this.top) + 'px');
    }
});