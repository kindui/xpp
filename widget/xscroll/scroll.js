X.add({
    name: 'Scroll',
    opt: {
        requestCount:1,
        usePull2Refresh:true,
        usePull2AddMore:true,
        loadingHeadClassName:'x_iscroll_loading_head',
        loadingFootClassName:'x_iscroll_loading_foot',
        pull2RefreshCb:null,
        clickAddMoreCb:null,
        _isLoading:false
    },
    MSG:{
        clickAddMore:'查看更多',
        clickAddMoreLoading:'正在加载...',
        pull2Refresh:'下拉刷新',
        pull2RefreshRelease:'放手刷新',
        pull2RefreshLoading:'加载中...'
    },
    _init: function(){
        this.process();
        this.initIscroll();
    },
    process:function(){
        this.dom  = this.el.firstElementChild;
        this.ul = this.dom.firstElementChild;

//        if(this.usePull2Refresh == true){
//            this.addStyle(this.getloadingHeadCss());
//            this.loadingHead = this.df('<div class="'+this.loadingHeadClassName+'">'+this.MSG.pull2Refresh+'</div>');
//            this.ul.insertBefore(this.loadingHead, this.ul.firstElementChild);
//        }
        if(this.usePull2AddMore == true){
            this.addStyle(this.getloadingFootCss());
            this.loadingFoot = this.df('<div data-type="add_more" class="'+this.loadingFootClassName+'">'+this.MSG.clickAddMore+'</div>');
            this.ul.appendChild(this.loadingFoot);

            this.on(this.loadingFoot,'click',this.clickAddMore);
        }
    },
    initIscroll:function(){
        this.iscroll = new IScroll(this.el, {
            mouseWheel: true,
            scrollbars: true,
            usePull2Refresh:this.usePull2Refresh,
            preventDefaultException: { className: /(^|\s)x_iscroll_loading_foot(\s|$)/ }
        });
        this.bindThis(['scrollStart','scrollMove','scrollEnd']);
        this.iscroll.on('scrollStart',this.scrollStart);
        this.iscroll.on('scrollMove',this.scrollMove);
        this.iscroll.on('scrollEnd',this.scrollEnd);
    },
    scrollStart:function(){
    },
    scrollMove:function(y){
//        if(y >= 40){
//            this.loadingHead.textContent =this.MSG.pull2RefreshRelease;
//        }
//        else if(y>=0 && y <40){
//            this.loadingHead.textContent = this.MSG.pull2Refresh;
//        }
    },
    scrollEnd:function(){
//        console.log('scrollEnd');
    },
    refreshComplete:function(){
        this.iscroll.scrollToElement(this.ul.children[1], 1000);
    },
    complete:function(){
        this._isLoading = false;
        this.loadingFoot.textContent = this.MSG.clickAddMore;
    },
    prepend:function(dom){
        if(typeof(dom) == 'string'){
            dom = this.df(dom);
        }
        this.ul.insertBefore(dom,this.ul.firstElementChild);
        this.iscroll.refresh();
    },
    append:function(dom){
        if(typeof(dom) == 'string'){
            dom = this.df(dom);
        }
        this.ul.insertBefore(dom,this.loadingFoot);
        this.iscroll.refresh();
    },
    clickAddMore:function(e){
        if(this._isLoading == true) return ;
        this._isLoading = true;

        this.loadingFoot.textContent = this.MSG.clickAddMoreLoading;
        this.requestCount ++;
        this.clickAddMoreCb && this.clickAddMoreCb.apply(this,[this.requestCount]);
    },
    bindEvent: function(){
        
    },
    getloadingHeadCss:function(){
        var s = '\
        .{loadingHeadClassName}{\
        height: 40px;\
        width: 100%;\
        border: 1px solid green;\
        text-align: center;\
        position: absolute;\
        left: 0;\
        top: 0;\
        margin-top: -40px;\
        line-height: 40px;\
        }';
        return this.tpl2replace(s,{loadingHeadClassName:this.loadingHeadClassName});
    },
    getloadingFootCss:function(){
        var s = '\
        .{loadingFootClassName}{\
            height: 40px;\
            line-height: 40px;\
            text-align: center;\
            font-size: 15px;\
        }';
        return this.tpl2replace(s,{loadingFootClassName:this.loadingFootClassName});
    }
});
