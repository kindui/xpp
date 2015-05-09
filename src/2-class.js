function createClass(Parent) {
    function Sub() {
        var args = [].slice.call(arguments);
        var init = function (SuperClass) {
            if (SuperClass.prototype.superclass) {
                init(SuperClass.prototype.superclass.constructor);
            }
            SuperClass.prototype._init.apply(this, args);
        }.bind(this);
        init(Parent);
        Sub.prototype['_init'] && Sub.prototype['_init'].apply(this, args);
    }

    var F = function () {
    }
    F.prototype = Parent.prototype;
    Sub.prototype = new F();
    Sub.prototype.constructor = Sub;
    Sub.prototype.superclass = Parent.prototype;
    Sub.extend = function (props) {
        var Sub = createClass(this);
        for (var p in props) {
            Sub.prototype[p] = props[p];
        }
        if (props.name) {
            X.widgets[props.name] = Sub;
        } else {
            X.widgets['widget-' + XPP_WIDGET_ID++] = Sub;
        }
        return Sub;
    }
    return Sub;
};