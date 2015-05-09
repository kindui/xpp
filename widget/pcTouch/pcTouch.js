(function () {
    function parseEvent(oldEvent) {
        var event = oldEvent;
        var touch = {
            pageX: oldEvent.pageX,
            pageY: oldEvent.pageY,
            clientX: oldEvent.clientX,
            clientY: oldEvent.clientY,
            target: oldEvent.target
        }
        event.touches = [];
        event.touches.push(touch);

        event.changedTouches = [];
        event.changedTouches.push(touch);
        event.targetTouches = [];
        event.targetTouches.push(touch);
        return event;
    }

    var addEventListener = Node.prototype.addEventListener;
    var  supportTouch = false;
    if(/Android|webOS|iPhone|Windows Phone|iPod|BlackBerry|SymbianOS|Mobile/i.test(navigator.userAgent)){
        supportTouch = true;
    }
    var UUID = 1;
    var X =  window.X = window.X || {};
    X.events={};
    Node.prototype.addEventListener = function (eventType, callback, isBubble) {
        var self = this;
        X.events[self.outerHTML.match(/.*/)[0].substr(0,50)+'#'+UUID++] = eventType;
        if (supportTouch) {
            addEventListener.call(self,eventType, callback, isBubble);
        } else {
            switch (eventType) {
                case 'touchstart':
                    addEventListener.call(self,'mousedown', function (e) {
                        callback.call(self,parseEvent(e));
                    }, isBubble);
                    break;
                case 'touchmove':
                    addEventListener.call(self,'mousemove', function (e) {
                        if (e.which == 1) {
                            callback.call(self,parseEvent(e));
                        }
                    }, isBubble);
                    break;
                case 'touchend':
                    addEventListener.call(self,'mouseup', function (e) {
                        callback.call(self,parseEvent(e));
                    }, isBubble);
                    break;
                default:
                    addEventListener.call(self,eventType, callback, isBubble);
            }
        }
    }
})();