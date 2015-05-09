/**
 * author: human
 * date  : 2013-7-4
 */
X.add({
    name: 'Carousel',
    opt: {
        hd_ul: '.hd ul',
        bd_ul: '.bd ul',
        prevEl: '.prev',
        nextEl: '.next',
        height: '100%',
        curIndex: 1,
        liCount: 0,
        liWidth: 0,
        curNavEl: 0,
        _isSwipe: 0,
        _startX: 0,
        _startY: 0,
        _deltaX: 0,
        _deltaY: 0,
        delayTime: 200,
        autoPlay: true,
        autoPlayTimerDelay: 3000,
        autoPlayTimer: 0
    },
    hasTouch: false,
    tap: (this.hasTouch ? 'touchend' : 'click'),
    _init: function () {
        this.hasTouch = this.detect.isTouchDevice;;
        this._cacheEl();
        this.compute();
        if (this.liCount == 1) {
            this.$hd_ul.parentNode.removeChild(this.$hd_ul);
            this.addStyle(this.cssText(this.elStr));
        } else {
            this._setupDom();
            this.addStyle(this.cssText(this.elStr));
            this._bindEvent();
        }
    },
    _cacheEl: function () {
        this.$hd_ul = this.$(this.hd_ul, this.el);
        this.$bd_ul = this.$(this.bd_ul, this.el);
        this.$prev = this.$(this.prevEl);
        this.$next = this.$(this.nextEl);
    },
    compute: function () {
        this.liWidth = this.liWidth || this.el.offsetWidth;
        this.liCount = this.$bd_ul.children.length;
    },
    _setupNav: function () {
        //nav
        for (var i = this.liCount; i > 0; i--) {
            this.$hd_ul.appendChild(this.df('<li></li>'));
        }
        this.$hd_ul.firstElementChild.className = 'on';
        this.curNavEl = this.$('.on', this.$hd_ul);
    },
    _setupBody: function () {
        //body
        this.$bd_ul.appendChild(this.$bd_ul.children[0].cloneNode(true));
        this.$bd_ul.insertBefore(this.$bd_ul.children[this.liCount - 1].cloneNode(true), this.$bd_ul.children[0]);
        this.liCount += 2;
        this.$bd_ul.style.webkitTransform = 'translate3d(-' + this.liWidth + 'px,0px,0px)';
    },
    _setupDom: function () {
        this._setupNav();
        this._setupBody();
    },
    _bindEvent: function () {
        this.hasTouch ? this.on(this.el, 'touchstart', this._touchStart) : this.on(this.el, 'mousedown', this._touchStart);
        this.$prev && this.on(this.$prev, this.tap, function (e) {
            this.prev();
        })
        this.$next && this.on(this.$next, this.tap, function () {
            this.next();
        });
        this._initAutoPlay();
    },
    prev: function () {
        this.curIndex--;
        this.doPlay();
    },
    next: function () {
        this.curIndex++;
        this.doPlay();
    },
    _initAutoPlay: function () {
        if (this.autoPlay) {
            var me = this;
            var autoPlayFun = function () {
                me.loadImg(-1);
                me.curIndex++;
                me.doPlay();
                me.autoPlayTimer = setTimeout(autoPlayFun, me.autoPlayTimerDelay);
            }
            me.autoPlayTimer = setTimeout(autoPlayFun, me.autoPlayTimerDelay);
        }
    },
    _clearAutoPlay: function () {
        clearTimeout(this.autoPlayTimer);
    },
    _touchStart: function (e) {
        this._clearAutoPlay();
        this._isSwipe = false;
        this._deltaX = 0;
        this._deltaY = 0;
        var point = this.hasTouch ? e.touches[0] : e;
        this._startX = point.pageX;
        this._startY = point.pageY;
        this.hasTouch ? this.on(this.el, 'touchmove', this._touchMove) : this.on(this.el, 'mousemove', this._touchMove);
        this.hasTouch ? this.on(this.el, 'touchend', this._touchEnd) : this.on(this.el, 'mouseup', this._touchEnd);
    },
    _touchMove: function (e) {
        if (e.touches && e.touches.length > 1) return; //two finger
        var point = this.hasTouch ? e.touches[0] : e;
        this._deltaX = parseInt(point.pageX - this._startX);
        this._deltaY = parseInt(point.pageY - this._startY);
        if (Math.abs(this._deltaX) < Math.abs(this._deltaY)) {
            this._isSwipe = false;
            return;
        } else {
            this._isSwipe = true;
        }
        if (this._isSwipe) {
            this.loadImg(this._deltaX);
            e.preventDefault();
            this.translate(-this.curIndex * this.liWidth + this._deltaX);
        }
    },
    _touchEnd: function (e) {
        e.preventDefault();
        if (this._isSwipe) {
            if (Math.abs(this._deltaX) > this.liWidth / 10) {
                this._deltaX > 0 ? this.curIndex-- : this.curIndex++;
            }
        }
        this.hasTouch ? this.off(this.el, 'touchmove', this._touchMove) : this.off(this.el, 'mousemove', this._touchMove);
        this.hasTouch ? this.off(this.el, 'touchend', this._touchEnd) : this.off(this.el, 'mouseup', this._touchEnd);
        this.doPlay();
        this._initAutoPlay();
    },
    translate: function (x, duringTime) {
        this.$bd_ul.style.webkitTransition = duringTime ? duringTime + 'ms' : '0ms';
        this.$bd_ul.style.webkitTransform = 'translate3d(' + x + 'px,0px,0px)';
    },
    loadImg: function (deltaX) {
        var loadImgOne = function (index) {
            var img = this.$bd_ul.getElementsByTagName('img')[index];
            var realPath = img.getAttribute('_src');
            if (realPath) {
                img.src = realPath;
                img.removeAttribute('_src');
            }
        }.bind(this);
        if (this.curIndex == 1) {
            loadImgOne(this.liCount - 2 - 1);
            loadImgOne(0);
        } else if (deltaX > 0) {
            loadImgOne(this.curIndex - 1);
        } else {
            loadImgOne(this.curIndex + 1);
        }
    },
    doPlay: function () {
        var me = this;
        var posX = -this.curIndex * this.liWidth;
        this.translate(posX, this.delayTime);
        if (this.curIndex == 0) {
            me.curIndex = me.liCount - 2;
            setTimeout(function () {
                me.translate(-(me.liCount - 2) * me.liWidth);
            }, this.delayTime);
        } else if (this.curIndex == this.liCount - 1) {
            me.curIndex = 1;
            setTimeout(function () {
                me.translate(-me.liWidth);
            }, this.delayTime);
        }
        if (this.curNavEl) {
            this.curNavEl.classList.remove('on');
            this.curNavEl = this.$hd_ul.children[this.curIndex - 1];
            this.curNavEl.classList.add('on');
        }
    },
    cssText: function (name) {
        var rs = '\
             {name}{\
               position:relative;\
             }\
            {name} .hd{\
            position:  absolute;\
               width:     100%;\
               z-index:   1;\
               bottom:    5px;\
               text-align:center;\
            }\
            {name} .hd ul{\
               display:              inline-block;\
               height:               7px;\
               padding:              3px 5px;\
               font-size:            0;\
               background-color:     rgba(255, 255, 255, 0.7);\
               -webkit-border-radius:5px;\
            }\
            {name} .hd ul li{\
               display:              inline-block;\
               width:                7px;\
               height:               7px;\
               margin:               0 5px;\
               vertical-align:       top;\
               overflow:             hidden;\
               -webkit-border-radius:7px;\
               background:           #8C8C8C;\
            }\
            {name} .hd ul .on{\
               background:#FE6C9C;\
            }\
            {name} .bd{\
               position:relative;\
               overflow:hidden;\
            }\
            {name} .bd ul{\
               position:          relative;\
               width:             {ulWidth}px;\
               padding:           0px;\
               margin:            0px;\
               -webkit-transition:00ms;\
               -webkit-transform: translate3d(0px, 0px, 0px);\
            }\
            {name} .bd li{\
               display: table-cell;\
               vertical-align: middle;\
               text-align: center;\
            }\
            {name} .bd a{\
               position:relative;\
            }\
            {name} .bd li img{\
               width:     {liWidth}px;\
               height:   {height};\
               background:url(images/loading.gif) center center no-repeat;\
            }';
        return rs.replace(/{name}/g, name).replace(/{ulWidth}/g, this.liCount * this.liWidth).replace(/{liWidth}/g, this.liWidth).replace(/{height}/g, this.height);
    }
})