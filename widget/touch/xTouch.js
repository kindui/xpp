(function(X){
    var base = X.base;
    var touch = function(el, eventType, callback){
        var startX;
        var startY;
        var deltaX;
        var deltaY;
        var isSwipeed = false;
        var isTapped = false;
        var tapTimmer;
        var tapDelay = 250;

        function outofTap(){
            isTapped = true;
        }

        switch(eventType){
            case 'swipeleft' :
                el.addEventListener('swipeleft', function(e){
                    if(isSwipeed == true) return;
                    isSwipeed = true;
                    callback.call(el, e);
                }, false);
                break;
            case 'swiperight' :
                el.addEventListener('swiperight', function(e){
                    if(isSwipeed == true) return;
                    isSwipeed = true;
                    callback.call(el, e);
                }, false);
                break;
            case 'tap' :
                el.addEventListener('tap', function(e){
                    if(isTapped == true) return;
                    isTapped = true;
                    callback.call(el, e);
                }, false);
                break;
        }
        el.addEventListener('touchstart', function(e){
            isSwipeed = false;
            isTapped = false;
            tapTimmer = setTimeout(outofTap,tapDelay);
            var touch = e.touches[0];
            startX = touch.pageX;
            startY = touch.pageY;
        }, false);
        el.addEventListener('touchmove', function(e){
            var touch = e.changedTouches[0];
            deltaX = startX - touch.pageX;
            deltaY = startY - touch.pageY;
            if(deltaX > 30){
                base.trigger(el, 'swipeleft');
            }else if(deltaX < -30){
                base.trigger(el, 'swiperight');
            }
        }, false);
        el.addEventListener('touchend', function(e){
            clearTimeout(tapTimmer);
            if(isSwipeed == true) return;
            var touch = e.changedTouches[0];
            deltaX = startX - touch.pageX;
            deltaY = startY - touch.pageY;
            if(e.target == e.currentTarget &&deltaX > -10 && deltaX < 10 && deltaY < 10 && deltaY > -10){
                base.trigger(el, 'tap');
                e.stopPropagation();
            }
            if(isSwipeed == false){
                if(deltaX > 30){
                    base.trigger(el, 'swipeleft');
                }else if(deltaX < -30){
                    base.trigger(el, 'swiperight');
                }
            }
        }, false);
    }
    X.touch = touch;
})(X);