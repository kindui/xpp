//human _2014-7-23
X.add( {
    name:'PageSlider',
    opt: {
        pageX: null,
        pageY: null,
        width: 0,
        height: 0,
        move: 0,
        swipe: 'Y',
        current: null,
        currentIndex: 0,
        pageClass: '.page',
        pages: null,
        pageCount: 0,
        nextEl: null,
        prevEl: null,
        setXyMethod: null,
        hwDimension: null
    },
    play: function(){
        this.current.classList.add('play');
    },
    _init: function(){
        this.pages = this.$$(this.pageClass, this.el);
        this.pageCount = this.pages.length;
        this.current = this.pages[0];
        this.nextEl = this.pages[1];
        this.resize().bindEvent();
    },
    resize: function(){
        this.width = this.el.clientWidth;
        this.height = this.el.clientHeight;
        if(this.swipe == 'Y'){
            this.setXyMethod = 'setY';
            this.hwDimension = 'height';
        }else{
            this.setXyMethod = 'setX';
            this.hwDimension = 'width';
        }
        return this
    },
    bindEvent: function(){
        var events = 'touchstart touchmove touchend'.split(' ');
        events.forEach(function(evn){
            this.on(this.el, evn, this[evn]);
        }.bind(this));
    },
    touchstart: function(e){
        var touches = e.touches[0];
        this.direction = null;
        this.move = 0;
        this.pageX = touches.pageX;
        this.pageY = touches.pageY;
    },
    touchmove: function(e){
        var touches = e.touches[0];
        var X = touches.pageX - this.pageX;
        var Y = touches.pageY - this.pageY;
        this.nextEl = this.current.nextElementSibling;
        this.prevEl = this.current.previousElementSibling;
        if(!this.direction){
            this.direction = Math.abs(X) > Math.abs(Y) ? 'X' : 'Y';
            if(this.direction === this.swipe){
                this.current.classList.add('moving')
                this.nextEl && this.nextEl.classList.add('moving');
                this.prevEl && this.prevEl.classList.add('moving');
            }
        }
        if(this.direction === this.swipe){
            e.preventDefault();
            e.stopPropagation();
            if(this.currentIndex == 0){
                if(Y > 0){
                    Y = Y * 0.2;
                }
                if(X > 0){
                    X = X * 0.2;
                }
            }else if(this.currentIndex == this.pageCount - 1){
                if(Y < 0){
                    Y = Y * 0.2;
                }
                if(X < 0){
                    X = X * 0.2;
                }
            }else{
                X = X * 0.5;
                Y = Y * 0.5;
            }
            switch(this.swipe){
                case 'X':
                    this.move = X;
                    this.setX(this.current, X);
                    this.nextEl && ( this.setX(this.nextEl, X + this.width) );
                    this.prevEl && ( this.setX(this.prevEl, X - this.width) );
                    break;
                case 'Y':
                    this.move = Y;
                    this.setY(this.current, Y);
                    this.nextEl && ( this.setY(this.nextEl, Y + this.height) );
                    this.prevEl && ( this.setY(this.prevEl, Y - this.height) );
                    break;
            }
        }
    },
    touchend: function(e){
        e.preventDefault();
        var minRange = 50;
        var move = this.move;
        if(move < -minRange && this.nextEl){
            return this.next();
        }
        if(move > minRange && this.prevEl){
            return this.prev()
        }
        if(this.swipe == this.direction){
            this.reset();
        }
    },
    setX: function(el, posX){
        el.style.webkitTransform = 'translate3d(' + posX + 'px, 0px, 0px)';
    },
    setY: function(el, posY){
        el.style.webkitTransform = 'translate3d(0px, ' + posY + 'px, 0px)';
    },
    next: function(){
        this._removeMovingClass();
        this[this.setXyMethod](this.current, -this[this.hwDimension]);
        this[this.setXyMethod](this.nextEl, 0);
        this.current = this.nextEl;
        this.currentIndex++;
        this._addCurrentClass();
    },
    prev: function(){
        this._removeMovingClass();
        this[this.setXyMethod](this.prevEl, 0);
        this[this.setXyMethod](this.current, +this[this.hwDimension]);
        this.current = this.prevEl;
        this.currentIndex--;
        this._addCurrentClass();
    },
    reset: function(){
        this._removeMovingClass();
        this.prevEl && this[this.setXyMethod](this.prevEl, -this.height);
        this[this.setXyMethod](this.current, 0);
        this.nextEl && this[this.setXyMethod](this.nextEl, +this.height);
        this._addCurrentClass();
    },
    _removeMovingClass: function(){
        this.prevEl && this.prevEl.classList.remove('moving');
        this.nextEl && this.nextEl.classList.remove('moving');
        this.current.classList.remove('moving');
        this.current.classList.remove('play');
    },
    _addCurrentClass: function(){
        setTimeout(function(){
            this.current.classList.add('play');
        }.bind(this), 3e2);
    }
});