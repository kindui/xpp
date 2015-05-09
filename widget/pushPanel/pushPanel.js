X.add({
    name: 'PushPanel',
    tpl: '<div class="{selector} x-panel">\
                <div class="x-bg"></div>\
                <div class="x-panel-content"></div>\
            </div>',
    opt: {
        dom:null,
        direction: false,
        during: 200,
        opacity:0.3,
        className: 'x-panel',
        classLoaded: false
    },
    _init: function(){
        if(this.classLoaded == false){
            this.addStyle(this.getStyle());
            this.classLoaded = true;
        }
        this.el.style.display = 'block';
        this.selector = this.gen();
        this.dom = this.df(this.tpl2replace(this.tpl, {selector: this.selector}));
        this.background = this.$('.x-bg', this.dom);
        this.panel = this.$('.x-panel-content', this.dom);
        this.panel.appendChild(this.el);
        document.body.appendChild(this.dom);
        this.initEvent();
    },
    initEvent: function(){
        this.on(this.background, 'click', function(e){
            this.hide();
        });
    },
    addInDirection: function(){
        this.panel.style.webkitTransition = '';
        switch(this.direction){
            case 'left':
                this.panel.style.left = 0;
                this.panel.style.right = 'auto';
                this.panel.style.top = '0';
                this.panel.style.bottom = 'auto';
                this.panel.style.height = '100%';
                this.panel.style.webkitTransform = 'translate(-100%,0)';
                break;
            case 'right':
                this.panel.style.right = 0;
                this.panel.style.left = 'auto';
                this.panel.style.top = '0';
                this.panel.style.bottom = 'auto';
                this.panel.style.height = '100%';
                this.panel.style.webkitTransform = 'translate(100%,0)';
                break;
            case 'up':
                this.panel.style.left = 0;
                this.panel.style.right = 0;
                this.panel.style.bottom = 0;
                this.panel.style.top = 'auto';
                this.panel.style.height = 'auto';
                this.panel.style.webkitTransform = 'translate(0,100%)';
                break;
            case 'down':
                this.panel.style.left = 0;
                this.panel.style.right = 0;
                this.panel.style.top = '0';
                this.panel.style.bottom = 'auto';
                this.panel.style.height = 'auto';
                this.panel.style.webkitTransform = 'translate(0,-100%)';
                break;
        }
    },
    inLeft: function(){
        this.direction = 'left';
        this.running();
    },
    running: function(){
        this.addInDirection();
        var offsetWidth = this.panel.offsetWidth;
        var offsetHeight = this.panel.offsetHeight;
        switch(this.direction){
            case 'left':
                document.body.style.webkitTransform = 'translate(' + offsetWidth + 'px,0)';
                break;
            case 'right':
                document.body.style.webkitTransform = 'translate(-' + offsetWidth + 'px,0)';
                break;
            case 'up':
                document.body.style.webkitTransform = 'translate(0,-' + offsetHeight + 'px)';
                break;
            case 'down':
                document.body.style.webkitTransform = 'translate(0,' + offsetHeight + 'px)';
                break;
        }
        this.background.style.opacity = this.opacity;
        this.dom.style.zIndex = 2;
    },
    inRight: function(){
        this.direction = 'right';
        this.running();
    },
    inDown: function(){
        this.direction = 'down';
        this.running();
    },
    inUp: function(){
        this.direction = 'up';
        this.running();
    },
    hide: function(){
        document.body.style.webkitTransform = 'translate(0,0)';
        this.dom.style.zIndex = -1;
        this.background.style.opacity = 0;
    },
    getStyle: function(){
        var s = '\
            body{\
                position:absolute;\
                left:0;\
                top:0;\
                width:100%;\
                height:100%;\
                -webkit-transition: all 0.5s ease;\
            }\
            .{className}{\
                position:  absolute;\
                left:      0;\
                right:     0;\
                top:       0;\
                bottom:    0;\
                background:transparent;\
                z-index:   -1;\
            }\
            .{className} .x-bg{\
                position:  absolute;\
                left:      0;\
                top:       0;\
                bottom:    0;\
                right:     0;\
                margin:    0;\
                padding:   0;\
                background:#000;\
                opacity:   0;\
            }\
            .{className} .x-panel-content{\
                position:  absolute;\
                left:      0;\
                top:       0;\
                margin:    0;\
                padding:   0;\
                height:    100%;\
                -webkit-transform: translate(-100%,0);\
            }';
        return this.tpl2replace(s, {className: this.className});
    }
});