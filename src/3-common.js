function returnElement(){
    var el;
    if(this instanceof Element){
        el = this;
    }else{
        el = this.el;
    }
    return el;
};
function mix(origin, add){
    for(var i in add){
        origin[i] = add[i];
    }
};
var common = {
    $: function(s, context){
        if(s.nodeType == 1) return s;
        if(context){
            return context.querySelector(s) || document.querySelector(s, context);
        }else{
            return document.querySelector(s);
        }
    },
    $$: function(s, context){
        var rs;
        if(context){
            rs = context.querySelectorAll(s) || document.querySelectorAll(s, context);
        }else{
            rs = document.querySelectorAll(s);
        }
        return [].slice.call(rs);
    },
    df: function(str){
        var div = document.createElement('div');
        div.innerHTML = str;
        if(div.children.length == 1){
            return div.firstElementChild;
        }else {
            var df  = document.createDocumentFragment();
            [].slice.call(div.children).forEach(function(item){
                df.appendChild(item);
            });
            return df;
        }
    },
    gen:function(prefix){
        prefix = prefix || 'W';
        return prefix + String(Math.random()).slice(2).substring(0, 16);
    },
    getTime:function(){
        return +new Date();
    },
    bindThis: function(arr){
        if(typeof(arr) == 'string'){
            this[arr] = this[arr].bind(this);
        }else if(Array.isArray(arr)){
            arr.forEach(function(method){
                this[method] = this[method].bind(this);
            }.bind(this))
        }
        return this;
    },
    addStyle: function(styleStr, doc){
        doc = doc || document;
        var style = doc.createElement('style');
        style.type = 'text/css';
        style.appendChild(doc.createTextNode(styleStr));
        doc.getElementsByTagName('HEAD')[0].appendChild(style);
    },
    mix: mix,
    clone: function(obj){
        var o;
        if(typeof obj == "object"){
            if(obj === null){
                o = null;
            }else{
                //array
                if(obj instanceof Array){
                    o = [];
                    for(var i = 0, len = obj.length; i < len; i++){
                        o.push(arguments.callee(obj[i]));
                    }
                    //date
                }else if(Object.prototype.toString.call(obj) == "[object Date]"){
                    return new Date(obj.toString());
                }else{
                    //object
                    o = {};
                    for(var k in obj){
                        o[k] = arguments.callee(obj[k]);
                    }
                }
            }
        }else{
            o = obj;
        }
        return o;
    },
    detect: function(){
        var ua = navigator.userAgent.toLowerCase();
        var rs = {
            isIphone: false,
            isIpad: false,
            isIpod: false,
            isSafari: false,
            isAndroid: false,
            isWindowsPhone: false,
            isMobile: false,
            isChrome: false,
            isTouchDevice: false
        }
        if(/Android|webOS|iPhone|Windows Phone|iPod|BlackBerry|SymbianOS|Mobile/i.test(ua)){
            rs.isMobile = true;
        }
        /iphone/.test(ua) && (rs.isIphone = true);
        /ipad/.test(ua) && (rs.isIpad = true);
        /ipod/.test(ua) && (rs.isIpod = true);
        /safari/.test(ua) && !/chrome/.test(ua) && (rs.isSafari = true);
        /android/.test(ua) && (rs.isAndroid = true);
        /windows phone/.test(ua) && (rs.isWindowsPhone = true);
        /chrome/.test(ua) && (rs.isChrome = true);
        rs.isTouchDevice = "ontouchstart" in window;
        return rs;
    }(),
    vendor: function(){
        var t = document.createElement('div');
        if(t.style.webkitTransform != undefined){
            return 'webkit';
            //移动端opera 也变成webkit内核了
        }else if(t.style.MozTransform != undefined){
            return 'moz';
        }
        return '';
    }(),
    urlObj: function(){
        var href = location.href;
        var rs = {};
        if(href.indexOf('?') != -1){
            href.split('?')[1].split('&').forEach(function(item){
                var arr = item.split('=');
                var k = arr[0];
                var v = decodeURIComponent(decodeURI(arr[1]));
                rs[k] = v;
            });
        }
        return rs;
    },
    dateFormat: function(date, formatString){
        /*
         * eg:formatString="YYYY-MM-DD hh:mm:ss";
         */
        if(formatString == undefined && typeof(date) == 'string'){
            formatString = date;
            date = new Date();
        }
        var o = {
            "M+": date.getMonth() + 1,
            "D+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        }
        if(/(Y+)/.test(formatString)){
            formatString = formatString.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for(var k in o){
            if(new RegExp("(" + k + ")").test(formatString)){
                formatString = formatString.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return formatString;
    },
    post: function(url, data, cb, opt){
        if(typeof(data) == 'function'){
            cb = data;
            data = {};
        }
        opt = opt || {};
        opt.url = url;
        opt.data = data;
        opt.method = 'post';
        opt.type = opt.type || 'json';
        opt.success = cb;
        this.ajax(opt);
    },
    get: function(url, cb, opt){
        opt = opt || {};
        opt.url = url;
        opt.type = opt.type || 'json';
        opt.success = cb;
        this.ajax(opt);
    },
    ajax: function(opt){
        var globalOpt = {
            url: null,
            timeout: this.ajaxConfig.timeout,
            timeoutCb: this.ajaxConfig.timeoutCb,
            jsonError: this.ajaxConfig.jsonError,
            method: 'get',
            type: 'text',
            beforeResponse: this.ajaxConfig.beforeResponse,
            afterResponse: this.ajaxConfig.afterResponse,
            success: null,
            error: null
        }
        //
        opt = opt || {};
        for(var config in globalOpt){
            opt[config] = opt[config] || globalOpt[config];
        }
        opt.asyn = opt.asyn === false ? false : true;
        opt.timeoutCb && (opt.timeoutCb = opt.timeoutCb.bind(this));
        opt.success && (opt.success = opt.success.bind(this));
        opt.error && (opt.error = opt.error.bind(this));
        var isPost = opt.method.toLowerCase() == 'post';
        try{
            var xhr = new XMLHttpRequest();
        }catch(e){
            opt.error && opt.error('Create Xhr error!');
        }
        xhr.onload = function(){
            var rs;
            var status = xhr.status;
            if((status >= 200 && status < 400)){
                clearTimeout(opt.timeout);
                switch(opt.type){
                    case 'text':
                        opt.success(xhr.responseText);
                        break;
                    case 'json':
                        try{
                            rs = JSON.parse(xhr.responseText);
                        }catch(e){
                            opt.jsonError();
                        }
                        //AOP start
                        var bRes = opt.beforeResponse && opt.beforeResponse(rs);
                        if(bRes === false) return;
                        opt.success(rs);
                        opt.afterResponse && opt.afterResponse(rs);
                        //AOP end
                        break;
                }
            }
        }
        xhr.onerror = function(){
            opt.error && opt.error('Xhr onerror trigger!');
        }
        if(isPost){
            var queryData = [];
            for(var i  in opt.data){
                queryData.push(i + "=" + opt.data[i]);
            }
            opt.data = queryData.join("&");
        }
        if(opt.timeout){
            opt.timeout = setTimeout(function(){
                opt.timeoutCb();
                xhr.onreadystatechange = null;
                xhr.abort();
            }, opt.timeout * 1000);
        }
        xhr.open(opt.method, opt.url, opt.asyn);
        isPost && xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(isPost ? opt.data : void(0));
        return this;
    },
    asynJSON: function (file, methodName, callback, charset) {
        var js = document.createElement("script"),
            head = document.getElementsByTagName("head")[0];

        window[methodName] = function (data) {
            window[methodName] = undefined;
            try {
                delete window[methodName]
            } catch (h) {
            }
            callback(data);
            head && setTimeout(function () {
                    head.removeChild(js)
                },
                5)
        };
        js.charset = charset || 'utf-8';
        js.src = file;
        head.appendChild(js)
    },
    on: function(el, eventType, callback){
        el._events = el._events || {};
        el._events[eventType] || (el._events[eventType] = {});
        var bEvent = callback.bind(this);
        el._events[eventType][callback] = bEvent;
        el.addEventListener(eventType, bEvent, false);
        return this;
    },
    delegate: function(parentEl, childEl, eventType, callback){
        var dgEvent = function(e){
            var children = this.$$(childEl, parentEl);
            var target = e.target;
            var currentTarget = e.currentTarget;
            while(children.indexOf(target) == -1 && currentTarget.contains(target) && currentTarget !== target){
                target = target.parentNode;
            }
            if(currentTarget == target){
                e.stopPropagation();
                return;
            }
            e.currentEl = target;
            callback.call(this, e);
            e.stopPropagation();
        }.bind(this);
        parentEl.addEventListener(eventType, dgEvent, false);
    },
    off: function(el, eventType, callback){
        var event = el._events && el._events[eventType];
        if(!event) return this;
        var bEvent;
        for(var i in event){
            if(i == callback){
                bEvent = event[i];
            }
        }
        el.removeEventListener(eventType, bEvent, false);
        delete el._events[eventType];
        return this;
    },
    trigger: function(el, eventType){
        var event = document.createEvent('HTMLEvents');
        event.initEvent(eventType, true, true);
        //event.initEvent(type, bubbles, cancelable);
        el.dispatchEvent(event);
    },
    getData: function(name){
        var rs = localStorage.getItem(name);
        try{
            rs = JSON.parse(rs);
            return rs;
        }catch(e){
            return rs;
        }
    },
    setData: function(name, data){
        if(typeof(data) == 'object'){
            try{
                data = JSON.stringify(data);
            }catch(e){
                console.log('xApp.js setData error');
            }
        }
        localStorage.setItem(name, String(data));
    },
    show: function(){
        returnElement.bind(this)().style.display = 'block';
    },
    hide: function(){
        returnElement.bind(this)().style.display = 'none';
    },
    css: function(name, value){
        var el = returnElement.bind(this)();
        if(typeof(name) == 'object'){
            for(var i in name){
                el.style[i] = name[i];
            }
            return;
        }
        if(value == undefined){
            return window.getComputedStyle(el, null)[name];
        }else{
            el.style[name] = value;
            return this;
        }
    },
    /**
     * <% for(...) { %>
     *     <p><%= obj.name %>
     * <% } %>
     * @param str
     * @param data
     * @returns {String}
     */
    tpl2html: function(str, data){
        var f = new Function("obj", "var p=[];" + "with(obj){p.push('" + str.replace(/\'/g, "\\'").replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('") + "');}return p.join('');");
        return f(data);
    },
    /**
     * tpl2obj('#ul',{'#a':'hehe','#b':'hh'}
     * @param el
     * @param dataObj
     * @returns {Base}
     */
    tpl2obj: function(el, dataObj){
        if(typeof(el) == 'string'){
            el = this.$(el);
        }
        for(var selector in dataObj){
            this.$(selector, el).innerHTML = dataObj[selector];
        }
        return this;
    },
    /**
     * tpl2replace( '<p>{name}</p><p>{age}</p>',{name:'tom',age:90} );
     * @param str
     * @param dataObj
     * @returns {String}
     */
    tpl2replace: function(str, dataObj){
        var reg;
        for(var i in dataObj){
            reg = new RegExp('{' + i + '}', 'g');
            str = str.replace(reg, dataObj[i]);
        }
        return str;
    }
};
