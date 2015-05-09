/**
 * author: human
 * date  : 2013-7-4
 */
X.define('Slider', {
    opt:{
        hd_ul:'.hd ul',
        bd_ul:'.bd ul',
        prevEl:'.prev',
        nextEl:'.next',
        height:'100%',
        curIndex:0,
        liCount:0,
        liWidth:0,
        curNavEl:0,
        _isSwipe:0,
        _startX:0,
        _startY:0,
        _deltaX:0,
        _deltaY:0,
        delayTime:200
    },
    hasTouch:(function(){
        return 'ontouchstart' in window ? true : false;
    })(),
    tap:(this.hasTouch ? 'touchend' : 'click'),
    _init:function(){
        this._cacheEl();
        this.compute();
        this._setupDom();
        this.addStyle(this.cssText(this.elStr));
        this._bindEvent();
    },
    _cacheEl:function(){
        this.$hd_ul = this.$(this.hd_ul, his.el);
        this.$bd_ul = this.$(this.bd_ul, this.el);
        this.$prev = this.$(this.prevEl);
        this.$next = this.$(this.nextEl);
    },
    compute:function(){
        this.liWidth = this.liWidth || this.el.offsetWidth;
        this.liCount = this.$bd_ul.children.length;
    },
    _setupNav:function(){
        //nav
        if(this.$hd_ul.children.length == 0){
            for(var i = this.liCount; i > 0; i--){
                this.append.call(this.$hd_ul, this.df('<li></li>'));
            }
            this.$hd_ul.firstElementChild.className = 'on';
        }
        this.curNavEl = this.$('.on', this.$hd_ul);
    },
    _setupDom:function(){
        this._setupNav();
    },
    _bindEvent:function(){
        this.hasTouch ? this.on(this.el, 'touchstart', this._touchStart) : this.on(this.el, 'mousedown', this._touchStart);
        this.$prev && this.on(this.$prev, this.tap, function(e){
            this.prev();
        });
        this.$next && this.on(this.$next, this.tap, function(){
            this.next();
        });
    },
    prev:function(){
        this.curIndex--;
        this.doPlay();
    },
    next:function(){
        this.curIndex++;
        this.doPlay();
    },
    _touchStart:function(e){
        this._isSwipe = false;
        this._deltaX = 0;
        this._deltaY = 0;
        var point = this.hasTouch ? e.touches[0] : e;
        this._startX = point.pageX;
        this._startY = point.pageY;
        this.hasTouch ? this.on(this.el, 'touchmove', this._touchMove) : this.on(this.el, 'mousemove', this._touchMove);
        this.hasTouch ? this.on(this.el, 'touchend', this._touchEnd) : this.on(this.el, 'mouseup', this._touchEnd);
    },
    _touchMove:function(e){
        if(e.touches && e.touches.length > 1) return; //two finger
        var point = this.hasTouch ? e.touches[0] : e;
        this._deltaX = parseInt(point.pageX - this._startX);
        this._deltaY = parseInt(point.pageY - this._startY);
        if(Math.abs(this._deltaX) < Math.abs(this._deltaY)){
            this._isSwipe = false;
            return;
        }else{
            this._isSwipe = true;
        }
        if(this._isSwipe){
            this.loadImg();
            e.preventDefault();
            if((this.curIndex == 0 && this._deltaX > 0) || (this.curIndex == this.liCount - 1 && this._deltaX < 0)){
                this._deltaX = this._deltaX * 0.3;
            }
            this.translate(this._deltaX - this.curIndex * this.liWidth);
        }
    },
    _touchEnd:function(e){
        e.preventDefault();
        if(this._isSwipe){
            if(Math.abs(this._deltaX) > this.liWidth / 10){
                this._deltaX > 0 ? this.curIndex-- : this.curIndex++;
            }
        }
        this.hasTouch ? this.off(this.el, 'touchmove', this._touchMove) : this.off(this.el, 'mousemove', this._touchMove);
        this.hasTouch ? this.off(this.el, 'touchend', this._touchEnd) : this.off(this.el, 'mouseup', this._touchEnd);
        this.doPlay();
    },
    translate:function(x, duringTime){
        this.$bd_ul.style.webkitTransition = duringTime ? duringTime + 'ms' : '0ms';
        this.$bd_ul.style.webkitTransform = 'translate3d(' + x + 'px,0px,0px)';
    },
    loadImg:function(){
        if(this.curIndex == this.liCount - 1){
            return;
        }
        var img = this.$bd_ul.getElementsByTagName('img')[this.curIndex + 1];
        var realPath = img.getAttribute('_src');
        img.src = realPath;
    },
    doPlay:function(){
        if(this.curIndex < 0){
            this.curIndex = 0;
        }else if(this.curIndex > this.liCount - 1){
            this.curIndex = this.liCount - 1;
        }
        var posX = -this.curIndex * this.liWidth;
        this.translate(posX,this.delayTime);
        this.curNavEl.classList.remove('on');
        this.curNavEl = this.$hd_ul.children[this.curIndex];
        this.curNavEl.classList.add('on');
    },
    cssText:function(name){
        var str = this.TEXT(function(){
            /*
             {name}{
             position:relative;
             }
             {name} .hd{
             position:  absolute;
             width:     100%;
             z-index:   1;
             bottom:    5px;
             text-align:center;
             }
             {name} .hd ul{
             display:              inline-block;
             height:               5px;
             padding:              3px 5px;
             font-size:            0;
             background-color:     rgba(255, 255, 255, 0.7);
             -webkit-border-radius:5px;
             }
             {name} .hd ul li{
             display:              inline-block;
             width:                5px;
             height:               5px;
             margin:               0 5px;
             vertical-align:       top;
             overflow:             hidden;
             -webkit-border-radius:5px;
             background:           #8C8C8C;
             }
             {name} .hd ul .on{
             background:#FE6C9C;
             }

             {name} .bd{
             position:relative;
             overflow:hidden;
             }
             {name} .bd ul{
             position:          relative;
             width:             {ulWidth}px;
             padding:           0px;
             margin:            0px;
             -webkit-transition:00ms;
             -webkit-transform: translate3d(0px, 0px, 0px);
             }
             {name} .bd li{
             display: table-cell;
             vertical-align: middle;
             text-align: center;
             }
             {name} .bd a{
             position:relative;
             }

             {name} .bd li img{
             width:     {liWidth}px;
             height:   {height};
             background:url(images/loading.gif) center center no-repeat;
             }

             */
        });
        return str.replace(/{name}/g, name).replace(/{ulWidth}/g, this.liCount * this.liWidth).replace(/{liWidth}/g, this.liWidth).replace(/{height}/g, this.height);
    }
})