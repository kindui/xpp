X.add({
    name: 'Scroll',
    opt: {

    },
    tpl: {
        loadingHead: '<div style="height:40px;line-height:40px;background:#ccc;border-top: none;text-align:center;">正在加载....</div>'
    },
    _init: function(){
        console.log('init');
        this.dom = this.el.firstElementChild;
        this.ul = this.dom.firstElementChild;
        this.preProcess();
        this.bindEvent();
    },
    preProcess: function(){
        this.y = 0;
        this.el.style.webkitTransitionProperty = 'translate';
        this.loadingHead = this.df(this.tpl.loadingHead);
        this.ul.insertBefore(this.loadingHead, this.ul.firstElementChild);
        this.loadingHeadHeight = this.loadingHead.offsetHeight;
        this.y = -this.loadingHeadHeight;

        this.height = this.dom.offsetHeight - this.el.offsetHeight;
        this.transform(this.y);
    },
    bindEvent: function(){
        this.on(this.dom, 'touchstart', this.handleEvent);
        this.on(this.dom, 'touchmove', this.handleEvent);
        this.on(this.dom, 'touchend', this.handleEvent);
    },
    _start: function(e){
        this.transitionTime();
        this.transitionFunction();
        var point = e.touches ? e.touches[0] : e;
        this.startY = point.pageY;
        this.startTime = this.lastTime = this.getTime();
        this.moved = false;
    },
    _move: function(e){

        //时间处理
        this.moveTime = this.getTime();
        var during = this.moveTime - this.startTime;
        if(during > 500){
            this.startTime = this.getTime();
        }
//        console.log('move during:' + during);


        var point = e.touches ? e.touches[0] : e;
        this.deltaY = point.pageY - this.startY;

        if(this.deltaY > 0 ){
            this.direction = 'up';
        }else if(this.deltaY < 0){
            this.direction = 'down';
        }

        this.moved = true;
        var translateY = this.y + this.deltaY;
        //        var timestamp = this.getTime();
        if(translateY > 10){
            console.log('****** pulling over')
        }
        this.transform(translateY);
    },
    _end: function(e){
        var point = e.changedTouches ? e.changedTouches[0] : e;

        //时间处理
        this.endTime = this.getTime();
        var during = this.endTime - this.startTime;
        if(during < 300){
            console.error('run speed!'+during)
            console.group('run');
            console.log('during:'+ during);
            console.log('startY:'+ this.startY);
            console.log('pageY:'+ point.pageY);
            console.log('deltaY:'+ (point.pageY - this.startY));
            console.groupEnd();

            this.transitionTime(2000);
            switch(this.direction){
                case 'up':
                    this.transform(this.y + this.deltaY + 500);
                    break;
                case 'down':
                    this.transform(this.y + this.deltaY - 500);
                    break;
            }
        }

        this.y = this.y + this.deltaY;

        //刷新处理
        if(this.y > 10){
            this.refreshHead();
        }else if(this.y > -this.loadingHeadHeight){
            this.resetHead();
        }
    },
    resetHead: function(){
        this.transitionTime(1000);
        this.transform(-this.loadingHeadHeight);
        this.y = -this.loadingHeadHeight;
    },
    refreshHead: function(){
        this.transitionTime(500);
        this.transform(0);
        this.y = 0;
        this.loadingHead.style.color = 'red';
        setTimeout(function(){
            this.resetHead();
        }.bind(this), 1000);
    },
    transitionTime: function(time){
        this.dom.style.webkitTransitionDuration = (time || '0') + 'ms';
    },
    transitionFunction: function(fun){
        this.dom.style.webkitTransitionTimingFunction = fun || 'ease';
    },
    transform: function(y){
        this.dom.style.webkitTransform = 'translate(0px,' + y + 'px)' + ' translateZ(0)';
    },
    handleEvent: function(e){
        switch(e.type){
            case  'touchstart':
                this._start(e);
                break;
            case   'touchmove':
                this._move(e);
                break;
            case   'touchend':
                this._end(e);
                break;
        }
    }
});
