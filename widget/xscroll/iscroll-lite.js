(function(window, document, Math){
    var utils = (function(){
        var me = {};
        var _elementStyle = document.createElement('div').style;
        var _vendor = (function(){
            var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'], transform, i = 0, l = vendors.length;
            for(; i < l; i++){
                transform = vendors[i] + 'ransform';
                if(transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
            }
            return false;
        })();

        function _prefixStyle(style){
            if(_vendor === false) return false;
            if(_vendor === '') return style;
            return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
        }

        me.getTime = Date.now || function getTime(){
            return new Date().getTime();
        };
        me.extend = function(target, obj){
            for(var i in obj){
                target[i] = obj[i];
            }
        };
        me.addEvent = function(el, type, fn, capture){
            el.addEventListener(type, fn, !!capture);
        };
        me.removeEvent = function(el, type, fn, capture){
            el.removeEventListener(type, fn, !!capture);
        };
        //IE10的touch事件
        me.prefixPointerEvent = function(pointerEvent){
            return window.MSPointerEvent ? 'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10) : pointerEvent;
        };
        //    这是什么函数？
        //    current：当前鼠标位置
        //    start：touchStart时候记录的Y（可能是X）的开始位置，但是在touchmove时候可能被重写
        //    time： touchstart到手指离开时候经历的时间，同样可能被touchmove重写
        //    lowerMargin：y可移动的最大距离，这个一般为计算得出 this.wrapperHeight - this.scrollerHeight
        //    wrapperSize：如果有边界距离的话就是可拖动，不然碰到0的时候便停止
        me.momentum = function(current, start, time, lowerMargin, wrapperSize, deceleration){
            var distance = current - start, speed = Math.abs(distance) / time, destination, duration;
            deceleration = deceleration === undefined ? 0.0006 : deceleration;
            destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
            duration = speed / deceleration;
            if(destination < lowerMargin){
                destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
                distance = Math.abs(destination - current);
                duration = distance / speed;
            }else if(destination > 0){
                destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
                distance = Math.abs(current) + destination;
                duration = distance / speed;
            }
            return {
                destination: Math.round(destination),
                duration: duration
            };
        };
        var _transform = _prefixStyle('transform');
        me.extend(me, {
            hasTransform: _transform !== false,
            hasPerspective: _prefixStyle('perspective') in _elementStyle,
            hasTouch: 'ontouchstart' in window,
            hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
            hasTransition: _prefixStyle('transition') in _elementStyle
        });
        // This should find all Android browsers lower than build 535.19 (both stock browser and webview)
        me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));
        me.extend(me.style = {}, {
            transform: _transform,
            transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
            transitionDuration: _prefixStyle('transitionDuration'),
            transitionDelay: _prefixStyle('transitionDelay'),
            transformOrigin: _prefixStyle('transformOrigin')
        });
        me.hasClass = function(e, c){
            var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
            return re.test(e.className);
        };
        me.addClass = function(e, c){
            if(me.hasClass(e, c)){
                return;
            }
            var newclass = e.className.split(' ');
            newclass.push(c);
            e.className = newclass.join(' ');
        };
        me.removeClass = function(e, c){
            if(!me.hasClass(e, c)){
                return;
            }
            var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
            e.className = e.className.replace(re, ' ');
        };
        //基于文档
        me.offset = function(el){
            var left = -el.offsetLeft, top = -el.offsetTop;
            // jshint -W084
            while(el = el.offsetParent){
                left -= el.offsetLeft;
                top -= el.offsetTop;
            }

            // jshint +W084
            return {
                left: left,
                top: top
            };
        };
        me.preventDefaultException = function(el, exceptions){
            for(var i in exceptions){
                if(exceptions[i].test(el[i])){
                    return true;
                }
            }
            return false;
        };
        me.extend(me.eventType = {}, {
            touchstart: 1,
            touchmove: 1,
            touchend: 1,

            mousedown: 2,
            mousemove: 2,
            mouseup: 2,

            pointerdown: 3,
            pointermove: 3,
            pointerup: 3,
            MSPointerDown: 3,
            MSPointerMove: 3,
            MSPointerUp: 3
        });
        me.extend(me.ease = {}, {
            quadratic: {
                style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fn: function(k){
                    return k * ( 2 - k );
                }
            },
            circular: {
                style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
                fn: function(k){
                    return Math.sqrt(1 - ( --k * k ));
                }
            },
            back: {
                style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                fn: function(k){
                    var b = 4;
                    return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
                }
            },
            bounce: {
                style: '',
                fn: function(k){
                    if(( k /= 1 ) < ( 1 / 2.75 )){
                        return 7.5625 * k * k;
                    }else if(k < ( 2 / 2.75 )){
                        return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
                    }else if(k < ( 2.5 / 2.75 )){
                        return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
                    }else{
                        return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
                    }
                }
            },
            elastic: {
                style: '',
                fn: function(k){
                    var f = 0.22, e = 0.4;
                    if(k === 0){
                        return 0;
                    }
                    if(k == 1){
                        return 1;
                    }
                    return ( e * Math.pow(2, -10 * k) * Math.sin(( k - f / 4 ) * ( 2 * Math.PI ) / f) + 1 );
                }
            }
        });
        me.tap = function(e, eventName){
            var ev = document.createEvent('Event');
            ev.initEvent(eventName, true, true);
            ev.pageX = e.pageX;
            ev.pageY = e.pageY;
            e.target.dispatchEvent(ev);
        };
        me.click = function(e){
            var target = e.target, ev;
            if(!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)){
                ev = document.createEvent('MouseEvents');
                ev.initMouseEvent('click', true, true, e.view, 1, target.screenX, target.screenY, target.clientX, target.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
                ev._constructed = true;
                target.dispatchEvent(ev);
            }
        };
        return me;
    })();

    function IScroll(el, options){
        this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
        this.scroller = this.wrapper.children[0];
        this.scrollerStyle = this.scroller.style;		// cache style for better performance
        this.options = {
            startY: 0,
            scrollY: true,
            directionLockThreshold: 5,
            momentum: true,
            bounce: true,
            bounceTime: 600,
            bounceEasing: '',
            preventDefault: true,
            preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },
            HWCompositing: true,
            useTransition: true,
            useTransform: true
        };
        //usePull2Refresh
        for(var i in options){
            this.options[i] = options[i];
        }
        // Normalize options
        this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';
        this.options.useTransition = utils.hasTransition && this.options.useTransition;
        this.options.useTransform = utils.hasTransform && this.options.useTransform;
        this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;
        // If you want eventPassthrough I have to lock one of the axes
        this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
//        this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;
        // With eventPassthrough we also need lockDirection mechanism
        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;
        this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;
        this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;
        if(this.options.tap === true){
            this.options.tap = 'tap';
        }
        // INSERT POINT: NORMALIZATION
        // Some defaults
        this.y = 0;
        this.directionY = 0;
        this._events = {};
        // INSERT POINT: DEFAULTS
        this._init();
        this.refresh();
        this.scrollTo(this.options.startY);
        this.enable();
    }

    IScroll.prototype = {
        version: '5.1.2',
        _init: function(){
            this._initEvents();
        },
        destroy: function(){
            this._initEvents(true);
            this._execEvent('destroy');
        },
        //transition 结束后再次判断边界
        _transitionEnd: function(e){
            if(e.target != this.scroller || !this.isInTransition){
                return;
            }
            //恢复平滑移动
            this._transitionTime();
            //判断边界情况
            if(!this.resetPosition(this.options.bounceTime)){
                //如果不是边界情况
                this.isInTransition = false;
                //这里触发的scrollEnd
                this._execEvent('scrollEnd');
            }
        },
        _start: function(e){
            // React to left mouse button only
            //右键无效
            if(utils.eventType[e.type] != 1){
                if(e.button !== 0){
                    return;
                }
            }

            //开关
            if(!this.enabled){
                return;
            }

            var point = e.touches ? e.touches[0] : e, pos;

            if(this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)){
                e.preventDefault();
            }

            this.moved = false;
            this.distY = 0;
            this.directionY = 0;

            this._transitionTime();  //是否可以不要。

            this.startTime = utils.getTime();

            if(this.options.useTransition && this.isInTransition){
                //如果正在滚动中，马上停止。
                this.isInTransition = false;
                pos = this.getComputedPosition(); //得到当前的translate 坐标
                this._translate(Math.round(pos.y)); //拿到当前坐标马上停止滚动
                this._execEvent('scrollEnd');  // 手指取消掉了

            }
            //初始化
            this.startY = this.y;
            this.absStartY = this.y;
            this.pointY = point.pageY;  //手指页面位置
            this._execEvent('beforeScrollStart');
        },
        _move: function(e){
            if(!this.enabled){
                return;
            }

            if(this.options.preventDefault){ //增强性能
                e.preventDefault();
            }

            var point = e.touches ? e.touches[0] : e,

                timestamp = utils.getTime(), //当前时间

                newY;

            var deltaY = point.pageY - this.pointY; // deltaY增量Y
            this.pointY = point.pageY;  //手指当前位置

            this.distY += deltaY;   // 目的Y坐标

            var absDistY = Math.abs(this.distY); //目的Y坐标 绝对值

            //endTime = 0
            if(timestamp - this.endTime > 300 && (absDistY < 10)){
                //位移 < 10 不要移动
                return;
            }

            newY = this.y + deltaY;

            //到顶了 或者到底了
            if(newY > 0 || newY < this.maxScrollY){
                newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
            }


            // -1: 向上  1:向下    0:没变
            this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

            //刚第一次touchmove开始滑动
            if(!this.moved){
                this._execEvent('scrollStart');
            }

            this.moved = true;

            //开始移动
            this._translate(newY);

            /* REPLACE START: _move */

            //如果手指停留超过300毫秒，重新定义startTime, startY
            if(timestamp - this.startTime > 300){
                this.startTime = timestamp;
                this.startY = this.y;
            }


            this._execEvent('scrollMove', newY);
            /* REPLACE END: _move */
        },
        _end: function(e){

            if(!this.enabled){
                return;
            }

            if(this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)){
                e.preventDefault();
            }
            var momentumY,
                duration = utils.getTime() - this.startTime,
                newY = Math.round(this.y),
                distanceY = Math.abs(newY - this.startY),
                time = 0,
                easing = '';


            this.isInTransition = false;
            this.endTime = utils.getTime();

            //  边界检测，如果超界 返回true
            if(this.resetPosition(this.options.bounceTime)){
                return;
            }

            this.scrollTo(newY);	// ensures that the last position is rounded

            // we scrolled less than 10 pixels
//            if(!this.moved){
//                if(this.options.tap){
//                    utils.tap(e, this.options.tap);
//                }
//                if(this.options.click){
//                    utils.click(e);
//                }
//                this._execEvent('scrollCancel');
//                return;
//            }


            if(this._events.flick && duration < 200  && distanceY < 100){
                this._execEvent('flick');
                return;
            }

            // start momentum animation if needed
            if(this.options.momentum && duration < 300){
                momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
                newY = momentumY.destination;
                time =  momentumY.duration;
                this.isInTransition = 1;
            }

            // INSERT POINT: _end

            // 如果获得了加速度，就执行自然滚动惯性
            if(newY != this.y){
                //如果滚动到的区域出界了，改变ease函数
                if( newY > 0 || newY < this.maxScrollY){
                    easing = utils.ease.quadratic;
                }
                this.scrollTo(newY, time, easing);
                return;
            }
            //    这里其实是手指脱离屏幕的时候
            //		this._execEvent('scrollEnd');
        },
        _resize: function(){
            var that = this;
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(function(){
                that.refresh();
            }, this.options.resizePolling);
        },
        // reset if we are outside of the boundaries
        /**
         * 什么时候调用的？
         * 1、当webkitTransitionEnd 的时候
         * 2、当touchend 的时候
         */
        resetPosition: function(time){
            var y = this.y;
            time = time || 0;

            if(this.y > 0){
                    y = 0;
                //this.maxScrollY 负数
            }else if(this.y < this.maxScrollY){
                y = this.maxScrollY;
            }

            if(y == this.y){
                //返回false 不用处理边界
                return false;
            }
            //否则移动
            this.scrollTo(y, time, this.options.bounceEasing);
            return true;
        },
        disable: function(){
            this.enabled = false;
        },
        enable: function(){
            this.enabled = true;
        },
        refresh: function(){
            var rf = this.wrapper.offsetHeight;		// Force reflow
            this.wrapperWidth = this.wrapper.clientWidth;
            this.wrapperHeight = this.wrapper.clientHeight;
            /* REPLACE START: refresh */
            this.scrollerWidth = this.scroller.offsetWidth;
            this.scrollerHeight = this.scroller.offsetHeight;
            this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
            this.maxScrollY = this.wrapperHeight - this.scrollerHeight;
            /* REPLACE END: refresh */
            this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
            this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
            if(!this.hasHorizontalScroll){
                this.maxScrollX = 0;
                this.scrollerWidth = this.wrapperWidth;
            }
            if(!this.hasVerticalScroll){
                this.maxScrollY = 0;
                this.scrollerHeight = this.wrapperHeight;
            }
            this.endTime = 0;
            this.directionX = 0;
            this.directionY = 0;
            this.wrapperOffset = utils.offset(this.wrapper);
            this._execEvent('refresh');
            this.resetPosition();
            // INSERT POINT: _refresh
        },
        on: function(type, fn){
            if(!this._events[type]){
                this._events[type] = [];
            }
            this._events[type].push(fn);
        },
        off: function(type, fn){
            if(!this._events[type]){
                return;
            }
            var index = this._events[type].indexOf(fn);
            if(index > -1){
                this._events[type].splice(index, 1);
            }
        },
        _execEvent: function(type){
            if(!this._events[type]){
                return;
            }
            var i = 0, l = this._events[type].length;
            if(!l){
                return;
            }
            for(; i < l; i++){
                //			this._events[type][i].apply(null, [].slice.call(arguments, 1));
                this._events[type][i].apply(this, [].slice.call(arguments, 1));
            }
        },
        scrollBy: function(y, time, easing){
            y = this.y + y;
            time = time || 0;
            this.scrollTo(y, time, easing);
        },
        scrollTo: function(y, time, easing){
            easing = easing || utils.ease.circular;
            this.isInTransition = this.options.useTransition && time > 0;
            if(!time || (this.options.useTransition && easing.style)){
                this._transitionTimingFunction(easing.style);
                this._transitionTime(time);
                this._translate(y);
            }
        },
        scrollToElement: function(el, time, offsetX, offsetY, easing){
            el = el.nodeType ? el : this.scroller.querySelector(el);
            if(!el){
                return;
            }
            var pos = utils.offset(el);
            pos.top -= this.wrapperOffset.top;
            // if offsetX/Y are true we center the element to the screen
            if(offsetY === true){
                offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
            }
            pos.top -= offsetY || 0;
            pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;
            time = time === undefined || time === null || time === 'auto' ? Math.abs(this.y - pos.top) : time;
            this.scrollTo(pos.top, time, easing);
        },
        _transitionTime: function(time){
            time = time || 0;
            this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';
            if(!time && utils.isBadAndroid){
                this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
            }
            // INSERT POINT: _transitionTime
        },
        _transitionTimingFunction: function(easing){
            this.scrollerStyle[utils.style.transitionTimingFunction] = easing;
            // INSERT POINT: _transitionTimingFunction
        },
        _translate: function(y){
            if(this.options.useTransform){

                /* REPLACE START: _translate */
                this.scrollerStyle[utils.style.transform] = 'translate(0px,' + y + 'px)' + this.translateZ;
                /* REPLACE END: _translate */
            }
            this.y = y;
            // INSERT POINT: _translate
        },
        _initEvents: function(remove){
            var eventType = remove ? utils.removeEvent : utils.addEvent, target = this.options.bindToWrapper ? this.wrapper : window;
            eventType(window, 'orientationchange', this);
            eventType(window, 'resize', this);
            if(this.options.click){
                eventType(this.wrapper, 'click', this, true);
            }
            if(!this.options.disableMouse){
                eventType(this.wrapper, 'mousedown', this);
                eventType(target, 'mousemove', this);
                eventType(target, 'mousecancel', this);
                eventType(target, 'mouseup', this);
            }
            if(utils.hasPointer && !this.options.disablePointer){
                eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
                eventType(target, utils.prefixPointerEvent('pointermove'), this);
                eventType(target, utils.prefixPointerEvent('pointercancel'), this);
                eventType(target, utils.prefixPointerEvent('pointerup'), this);
            }
            if(utils.hasTouch && !this.options.disableTouch){
                eventType(this.wrapper, 'touchstart', this);
                eventType(target, 'touchmove', this);
                eventType(target, 'touchcancel', this);
                eventType(target, 'touchend', this);
            }
            eventType(this.scroller, 'transitionend', this);
            eventType(this.scroller, 'webkitTransitionEnd', this);
            eventType(this.scroller, 'oTransitionEnd', this);
            eventType(this.scroller, 'MSTransitionEnd', this);
        },
        //获得当前偏移的translate y
        getComputedPosition: function(){
            var matrix = window.getComputedStyle(this.scroller, null), x, y;
            if(this.options.useTransform){
                matrix = matrix[utils.style.transform].split(')')[0].split(', ');
                x = +(matrix[12] || matrix[4]);
                y = +(matrix[13] || matrix[5]);
            }else{
                x = +matrix.left.replace(/[^-\d.]/g, '');
                y = +matrix.top.replace(/[^-\d.]/g, '');
            }
            return { x: x, y: y };
        },
        handleEvent: function(e){
            switch(e.type){
                case 'touchstart':
                case 'pointerdown':
                case 'MSPointerDown':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'pointermove':
                case 'MSPointerMove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'pointerup':
                case 'MSPointerUp':
                case 'mouseup':
                case 'touchcancel':
                case 'pointercancel':
                case 'MSPointerCancel':
                case 'mousecancel':
                    this._end(e);
                    break;
                case 'orientationchange':
                case 'resize':
                    this._resize();
                    break;
                case 'transitionend':
                case 'webkitTransitionEnd':
                case 'oTransitionEnd':
                case 'MSTransitionEnd':
                    this._transitionEnd(e);
                    break;
                //			case 'wheel':
                //			case 'DOMMouseScroll':
                //			case 'mousewheel':
                //				this._wheel(e);
                //				break;
                case 'keydown':
                    this._key(e);
                    break;
                case 'click':
                    if(!e._constructed){
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    break;
            }
        }
    };
    IScroll.utils = utils;
    window.IScroll = IScroll;
})(window, document, Math);