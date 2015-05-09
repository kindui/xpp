//human 2014-7-28
X.add({
    name: 'CitySelector',
    opt: {
        selector: '.x-city-select',
        data: null,
        cityBeansName: 'cityBeans',
        cityBeansLetterName: 'letter',
        cityName: 'name',
        listEl: null,
        infoEl: null,
        cursorEl: null,
        opacityTime: '200ms',
        onSelect: null, //callback
        cityIdPrefix: 'city_selector_letter_',
        _isMoving: false,
        _startScrollTop: null
    },
    tpl: {
        head: '<div class="{selector}">\
                  <div class="x-city-select-list-container"> \
                    <div class="x-city-select-title">所有城市</div>',
        body: '\
                <% for(var i=0,L=cities.length; i<L; i++) {\
                       var citys = cities[i];\
                       var letter = citys.letter.toUpperCase();\
                %>\
                \
                <div class="x-city-select-order" id="{cityIdPrefix}<%={cityBeansLetterName}%>"><%={cityBeansLetterName}%></div>\
                <ul class="x-city-select-list">\
                    \
                    <% for(var j=0,J=citys.{cityBeansName}.length; j<J; j++) {\
                           var city = citys.{cityBeansName}[j];\
                           var cityStr = JSON.stringify(city);\
                    %>\
                        <li data-item=\'<%= cityStr %>\'><%=city.{cityName}%></li>\
                    <% } %>\
                </ul>\
                \
                <% } %>\
                </div>',
        foot: '\
                <div class="x-city-select-cursor">\
                        <ul>\
                <% for(var i=0,L=cities.length; i<L; i++) {\
                       var letter = cities[i].{cityBeansLetterName}.toUpperCase(); %>\
                        <li data-href="{cityIdPrefix}<%= letter %>"><%= letter %></li>\
                <% } %>\
                        </ul>\
                 </div>\
                 <div class="info">H</div>\
            </div>'
    },
    _init: function () {
        this.addStyle(this.getStyle());
        this.parseData();
        this.buildDom();
        this.bindEvent();
        this.fix();
    },
    fix: function () {
        this.cursorEl.style.top = (window.innerHeight - this.cursorEl.offsetHeight) / 2 + 'px';
        this.el.style.display = 'none';
    },
    parseData: function () {
        if (!this.data) {
            throw new Error('Data not defined!');
        }
        this.data = {
            cities: this.data
        }
    },
    _processCursorHover: function () {
        var lastCursorNode = null;
        return function (target) {
            lastCursorNode && lastCursorNode.classList.remove('hover');
            target.classList.add('hover');
            lastCursorNode = target;
        }
    }(),
    _processInfoContent: function (target) {
        this.infoEl.textContent = target.textContent.toUpperCase();
        this.infoEl.style.visibility = 'visible';
    },
    _gotoHref: function (href) {
        location.href = '#' + this.cityIdPrefix + href;
    },
    bindEvent: function () {
        this.listEl = this.$('.x-city-select-list-container', this.el);
        this.infoEl = this.$('.info', this.el);
        this.cursorEl = this.$('.x-city-select-cursor', this.el);
        this.on(this.listEl, 'touchstart', function (e) {
        });
        this.delegate(this.listEl, 'li', 'click', function (e) {
            var ret;
            if (this.onSelect) {
                ret = this.onSelect.bind(this)(JSON.parse(e.currentEl.dataset.item));
                if (ret !== false) {
                    this.hide();
                }
            } else {
                this.hide();
            }
        });

        this.delegate(this.cursorEl, 'li', 'touchstart', function (e) {
            this._isMoving = true;
            var target = e.currentEl;
            this._processCursorHover(target);
            this._processInfoContent(target);
            this._gotoHref(target.textContent);
        });

        this.on(this.cursorEl, 'touchmove', function (e) {
            this._isMoving = true;
            e.currentTarget.style.width = '100%';
            var touch = e.targetTouches[0];
            var pos = {
                x: touch.clientX,
                y: touch.clientY
            }
            var target = document.elementFromPoint(pos.x, pos.y);
            if (target && target.nodeName == 'LI' && target.parentNode.className === '') {
                this._processCursorHover(target);
                this._processInfoContent(target);
                this._gotoHref(target.textContent);
            }
            e.preventDefault();
        });

        this.on(this.cursorEl, 'touchend', function (e) {
            this._isMoving = false;
            e.currentTarget.style.width = '40px';
            this.infoEl.style.visibility = 'hidden';
        });
    },
    buildDom: function () {
        var tplFieldName = {
            cityIdPrefix: this.cityIdPrefix,
            selector: this.selector.substr(1),
            cityBeansName: this.cityBeansName,
            cityBeansLetterName: this.cityBeansLetterName,
            cityName: this.cityName
        }
        this.tpl.head = this.tpl2replace(this.tpl.head, tplFieldName);
        this.tpl.body = this.tpl2replace(this.tpl.body, tplFieldName);
        this.tpl.foot = this.tpl2replace(this.tpl.foot, tplFieldName);

        var body = this.tpl2html(this.tpl.body, this.data);
        var foot = this.tpl2html(this.tpl.foot, this.data);

        this.el = this.df(this.tpl.head + body + foot);
        document.body.appendChild(this.el);
    },

    show: function () {
        this._startScrollTop = document.body.scrollTop;
        this.el.style.visibility = 'visible';
        this.el.style.display = 'block';
        setTimeout(function () {
            document.body.scrollTop = 0;
            this.el.classList.add('play');
        }.bind(this), parseInt(this.opacityTime));
        this.on(window, 'hashchange', this.hashchange);
        return this;
    },
    hide: function () {
        this.off(window, 'hashchange', this.hashchange);
        this.el.classList.remove('play');
        setTimeout(function () {
            this.el.style.display = 'none';
        }.bind(this), 100);
        document.body.scrollTop = this._startScrollTop;
        return this;
    },
    hashchange: function (e) {
        if (this._isMoving == false) {
            this.hide();
        }
    },
    getStyle: function () {
        var style = '\
        {selector} {\
            visibility:hidden;\
            position: absolute;\
            left: 0;\
            top: 0;\
            width: 100%;\
            height: 100%;\
            font-family: "Helvetica Neue", Helvetica, STHeiTi, sans-serif;\
            -webkit-user-select:none;\
            z-index:99;\
        }\
        {selector} ul {\
            margin: 0;\
            padding: 0;\
            list-style: none;\
        }\
        {selector} .x-city-select-list-container{\
            -webkit-transition:all {opacityTime} ease;\
            -webkit-transform: translate(100%,0);\
        \
        }\
        .play .x-city-select-list-container{\
            -webkit-transform: translate(0px,0px);\
        \
        }\
        {selector} .x-city-select-title {\
            -webkit-box-sizing: border-box;\
            padding: 1px 15px;\
            border-top: 1px #B4B4B4 solid;\
            background: #D1D1D1;\
            color: #FFF;\
            font-size: 14px\
        }\
        {selector} .x-city-select-list li {\
            display: block;\
            padding: 8px 15px;\
            background: #FFF;\
            border-bottom: 1px #C1C1C1 solid;\
            color: #000\
        }\
        {selector} .x-city-select-list li:active {\
            background: #D1D1D1;\
        }\
        {selector} .x-city-select-list li:last-child {\
            border-bottom: 0\
        }\
        {selector} .x-city-select-order {\
            padding: 1px 15px;\
            background: #F7F7F7;\
            font-size: 14px\
        }\
        {selector} .x-city-select-cursor {\
            -webkit-user-select: none;\
            position: fixed;\
            right: 0;\
            top: 200px;\
            width: 40px;\
            text-align: right;\
            font-size: 14px;\
            color: #0099FF;\
            opacity:0;\
            -webkit-transition: all {opacityTime} ease;\
            -webkit-transition-delay: {opacityTime} ;\
            -webkit-transform:translate(0px,10px);\
        }\
        .play .x-city-select-cursor {\
            -webkit-transform:translate(0px,0px);\
            opacity:1;\
        }\
        {selector} .x-city-select-cursor ul {\
        }\
        {selector} .x-city-select-cursor ul:before {\
            content: "";\
            display: inline-block;\
            padding-right: 2px;\
            width: 16px;\
            height: 16px;\
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFMjRDNzI1NUM3RDExMUUzQjQ5NUZDRUEyRTU4MzBEMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFMjRDNzI1NkM3RDExMUUzQjQ5NUZDRUEyRTU4MzBEMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkUyNEM3MjUzQzdEMTExRTNCNDk1RkNFQTJFNTgzMEQzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkUyNEM3MjU0QzdEMTExRTNCNDk1RkNFQTJFNTgzMEQzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+XO8TtgAAAtVJREFUeNq8l12ITVEUx8+946OIeRlDvrvNCEPKLRkkJBIaIUVTPmpSwgMvSkwaxYMnyYNiEPJiyMcgksi3+zJJ+XyQ8WBefOQBM47fzro6ln3u3veemVn1a9+z97ln/ffe66y9TioMw8BluVyujGYBLIVpMBYGw1d4D4/gMlyFn3HPyWaz//WlCgnAcYpmLTSKU5e9gx1wFkIfAekCzofS3IRmT+fGRsMZuCO/nZaOcZ6heQjzgtJslmzLJNeNfSzOK2iux8z6I1yAJ/AZhkAN1MEIde8wiYlaiRM/AbLkVarvE+yEI9Bp+c8WWAf7oDLSPxJOw1z45dwCZr+SZom6582f+MkejnEeyMOPwVR4psZmw3pnDEjEN6pxs8yLcP7Wc+/bzf3Qofp3xaz2Pysw0xI023H+qsgANPu9SfWNgYUuAXVqzMz6RIlvwTloU33LXAJmqLEWZt9ZooBQklHUal0CqtXYrSCZ3VbX41wCKix7mcTa1XVfAr28kACdu1MJBXj9Pyqgw5LXk9godf0DvhQS8FKNzU8oQJ8jLwjqsJCAe2psOXvWr0Tn5rmrVd8D1xactyzhxhIF1MN4S26IF8DyPDYZWY3vZxWmFOncHGQHVd9rqS2c9cBudT0AWhEx2dN5tRzl5Zbnuk9DVqHVksGGm+IEEeY4HhjjuL85N6ROyKixa5ZnxteEkizugm3W38yKRAoSU7ZNgMVSpAaWVy+TT0reRSkizKxvwMQguZkKapWplr2LUm78IMdzSzcIMKfgKSjz2gLLaphjeg/4vA3P4bgUNjpeTsIGJtdVlICIkOnqw2SQpFbzLfAULsF9OVPmwBV5i6J2FBqiGdFbgIgoZulNBXQRdDY9BFvzItJBz5nJByvkTYjaZjjg/DLqJjPfi2ugS/VvYzX39oaA/BlQbxHxvbcEBJIJGyJFTxMx0BT3ZdRT1iwBWYXzv2fObwEGADxqx22PY0EaAAAAAElFTkSuQmCC") no-repeat;\
            background-size: 16px auto;\
        }\
        {selector} .x-city-select-cursor li {\
            padding-right: 5px;\
        }\
        {selector} .x-city-select-cursor li.hover {\
            color: red;\
        }\
        {selector} .info {\
            position: fixed;\
            visibility: hidden;\
            left: 50%;\
            top: 50%;\
            width: 80px;\
            height: 80px;\
            line-height: 80px;\
            margin-top: -40px;\
            margin-left: -40px;\
            text-align: center;\
            font-size: 80px;\
            color: white;\
            background: #ccc;\
            border-radius: 8px;\
        }';
        return this.tpl2replace(style, {selector: this.selector, opacityTime: this.opacityTime});
    }
});