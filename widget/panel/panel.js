
X.add({
    name: 'Panel',
    tpl: '<div class="{selector} x-panel">\
                <div class="x-bg"></div>\
                <div class="x-panel-content"></div>\
            </div>',
    opt: {
        direction: false,
        during: 300,
        className:'x-panel',
        classLoaded:false
    },
    _init: function(){
        if(this.classLoaded == false){
            this.addStyle(this.getStyle());
            this.classLoaded = true;
        }
        this.selector = 'W' + String(Math.random()).slice(2).substring(0, 8);
        this.dom = this.df(this.tpl2replace(this.tpl, {selector: this.selector}));
        this.background = this.$('.x-bg', this.dom);
        this.panel = this.$('.x-panel-content', this.dom);
        this.panel.appendChild(this.el);
        document.body.appendChild(this.dom);
        this.initEvent()
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
        setTimeout(function(){
            this.dom.style.zIndex = 2;
            this.panel.style.webkitTransition = 'all ' + this.during + 'ms ease';
            this.panel.style.webkitTransform = 'translate(0,0)';
            this.background.style.opacity = 0.1;
        }.bind(this), 0);
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
        switch(this.direction){
            case 'left':
                this.panel.style.webkitTransform = 'translate(-100%,0)';
                break;
            case 'right':
                this.panel.style.webkitTransform = 'translate(100%,0)';
                break;
            case 'up':
                this.panel.style.webkitTransform = 'translate(0,100%)';
                break;
            case 'down':
                this.panel.style.webkitTransform = 'translate(0,-100%)';
                break;
        }
        setTimeout(function(){
            this.dom.style.zIndex = -1;
            this.background.style.opacity = 0;
        }.bind(this), this.during);
    },
    getStyle:function(){
        var s ='\
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
                -webkit-transition:opacity 0.3ms ease;\
            }\
            .{className} .x-panel-content{\
                position:  absolute;\
                left:      0;\
                top:       0;\
                margin:    0;\
                padding:   0;\
                height:    100%;\
                background:red;\
                -webkit-transform: translate(-100%,0);\
            }';
        return this.tpl2replace(s,{className:this.className});
    }
});