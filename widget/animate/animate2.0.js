(function (X) {
    var base = X.base;

    function reset(el) {
        base.css.call(el, {
            'webkitTransitionProperty': '',
            'webkitTransitionDuration': '',
            'webkitTransitionTimingFunction': '',
            'webkitTransitionDelay': ''
        });
    }

    function Animate(el) {
        this.index = 0;
        this.el = el;
        this.items = [];
    }

    Animate.prototype = {
        constructor: Animate,
        add: function (item) {
            item.exec = function () {
                var item;
                if (item = this.items[this.index]) {
                    this.index++;
                    animateRun(this.el, item.property, item.during, item.effect, function (el) {
                        item.end(el);
                        var next;
                        if (next = this.items[this.index]) {
                            next.exec();
                        }
                    }.bind(this), item.delay);
                }
            }.bind(this);

            this.items.push(item);
            return this;
        },
        run: function () {
            this.index = 0;
            this.items[0].exec();
        }
    }

    function animateRun(el, properties, duration, ease, callback, delay) {
        var transitionProperty = '';
        if (typeof(el) == 'string') {
            el = base.$(el);
        }
        if (typeof(callback) == 'number') {
            delay = callback, callback = function () {
            };
        }
        duration = parseFloat(duration) / 1000;
        delay = delay == undefined ? '0' : parseFloat(delay) / 1000;
        transitionProperty = Object.keys(properties).join(',');

        base.css.call(el, {
            'webkitTransitionProperty': transitionProperty,
            'webkitTransitionDuration': duration + 's',
            'webkitTransitionTimingFunction': ease || 'ease',
            'webkitTransitionDelay': delay + 's'
        });

        var fired = false;

        var wrapCb = function () {
            if (fired) return;
            fired = true;
            base.off(el, 'webkitTransitionEnd', wrapCb);
            reset(el);
            callback(el);
        }.bind(this);

        base.on(el, 'webkitTransitionEnd', wrapCb);
        //fixed some android device not trigger webkitTransitionEnd
        setTimeout(function () {
            if (fired) return;
            wrapCb();
        }, ((duration + delay) * 1000) + 25);
        base.css.call(el, properties);
        return this;
    }

    X.animate = function (el) {
        return new Animate(el);
    }
})(X);