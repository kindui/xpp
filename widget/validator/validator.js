X.add({
    name: 'Validator',
    opt: {
        items: [],
        rules: {
            email: /^\s*([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,20})\s*$/,
            url: /^(\w+):\/\/([\w.]+)\/(\S*)/,
            number: /^-?[0-9]+(?:\.\d+)?$/
        },
        userRules: {},
        onError: function () {
        },
        onFocus: function () {
        }
    },
    _init: function () {
    },
    addRule: function (name, reg) {
        this.userRules[name] = reg;
    },
    validate:function(){
        var ret = true;
        this.items.forEach(function(item){
            var errorList = this.checkItem(item.el,item);
            if(errorList.length != 0){
                ret = false
            }
        }.bind(this));
        return ret;
    },
    checkItem: function (input, item) {
        var val = input.value;
        var length = val.length;
        var errorList = [];
        if (item.require) {
            if (val == '') {
                errorList.push('require');
            }
        }
        if (item.max) {
            if (length > item.max) {
                errorList.push('max');
            }
        }
        if (item.min) {
            if (length < item.min) {
                errorList.push('min');
            }
        }
        if (item.email) {
            this.rules.email.test(val) || errorList.push('email');
        }

        if (item.url) {
            this.rules.url.test(val) || errorList.push('url');
        }

        if (item.number) {
            this.rules.number.test(val) || errorList.push('number');
        }

        for (var i in this.userRules) {
            if (item[i]) {
                this.userRules[i].test(val) || errorList.push(i);
            }
        }
        if (errorList.length != 0) {
            item.onError(errorList, item.el);
            this.onError(errorList, item.el);
        }
        return errorList;
    },
    addItem: function (opt) {
        var item = {};
        if(typeof(opt.el) == 'string'){
            opt.el = this.$(opt.el, this.el);
        }
        this.mix(item, opt);

        this.preProcess(item);

        this.items.push(item);
        this.itemFocus(item);
        this.itemBlur(item);
        return this;
    },
    preProcess:function(item){
        if (item.placeholder) {
            item.el.placeholder = item.placeholder;
        }
        if(item.autoFocus){
            item.el.setAttribute('autofocus','')
        }
    },
    itemBlur: function (item) {
        this.on(item.el, 'blur', function (e) {
            this.checkItem(e.target, item);
        });
    },
    itemFocus: function (item) {
        this.on(item.el, 'focus', function (e) {
            item.onFocus && item.onFocus(item.el);
            this.onFocus && this.onFocus(item.el);
        });
    }
});
