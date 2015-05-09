XPP.app = function (props) {
    var Sub = createClass(APP);
    for (var p in props) {
        Sub.prototype[p] = props[p];
    }
    var w = XPP.apps['app-' + XPP_APP_ID++] = new Sub;
    return w;
};

XPP.add = function(props){
    var Sub = createClass(Widget);
    for(var p in props){
        Sub.prototype[p] = props[p];
    }

    //class init
    if(props._classInit){
        props._classInit.call(Sub.prototype);
    }
    //single mode
    if(props.single == true){
        Sub = new Sub;
    }

    if(props.name){
        XPP.widgets[props.name] = Sub;
    }else{
        XPP.widgets['widget-' + XPP_WIDGET_ID++] = Sub;
    }

    return Sub;
}
XPP.base = common;
window.X = XPP;