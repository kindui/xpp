X.add({
    name: 'PreloadImg',
    opt: {
        items: [],
        prefix: 'img/',
        complete: void(0),
        count: 0
    },
    _init: function () {
        this.count = this.items.length;
        this.loadIndex = 0;
        this.pct = 0;
        this.addPct = Math.floor(100 / this.count);
    },
    load: function () {
        var me = this;
        this.items.forEach(function (item) {
            var img = new Image;
            img.onload = img.onerror = img.onabort = function () {
                me.loadIndex++;
                if (me.loadIndex == me.count) {
                    me.complete && me.complete.call(me, 100, me.loadIndex);
                } else {
                    me.pct += me.addPct;
                    me.complete && me.complete.call(me, me.pct, me.loadIndex);
                }
            }
            img.src = me.prefix + item;
        });
    }
});