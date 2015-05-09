X.add({
    name: 'Msgbox',
    single: true,
    opt: {
        dialogClassName: 'xMsgbox_mask',
        ok: null,
        no: null,
        okBtn: null,
        noBtn: null,
        okCb: null,
        noCb: null,
        align: 'center',
        opacityTime: '200ms'
    },
    tpl: {
        mask: '<div class="xMsgbox_mask"></div>',
        dialog: '\
                <div class="dialog">\
                    <div class="inner">\
                        <div class="title"></div>\
                        <div class="text"></div>\
                    </div>\
                    <div class="buttons">\
                    </div>\
            </div>',
        button: '<span class="button">{name}</span>'
    },
    _init: function () {
        this.addStyle(this.getCss());

        this.el = this.df(this.tpl.mask);
        this.dialogEl = this.df(this.tpl.dialog);

        this.titleEl = this.$('.title', this.dialogEl);
        this.textEl = this.$('.text', this.dialogEl);
        this.buttonsEl = this.$('.buttons', this.dialogEl);
        this.on(document, 'DOMContentLoaded', function (e) {
            document.body.appendChild(this.el);
            document.body.appendChild(this.dialogEl);
            this.fix();
        });
    },
    show: function () {
        this.el.style.display = 'block';
        this.dialogEl.style.display = 'block';
        this.css.call(this.el, {
            opacity: 1,
            visibility: 'visible'
        });
        this.css.call(this.dialogEl, {
            opacity: 1,
            visibility: 'visible'
        });
//        this.fix();
        this.dialogEl.classList.remove('modal-out');
        this.dialogEl.classList.add('modal-in');

    },
    hide: function () {
        this.dialogEl.classList.remove('modal-in');
        this.dialogEl.classList.add('modal-out');

        this.css.call(this.el, {
            opacity: 0,
            visibility: 'hidden'
        });

        this.css.call(this.dialogEl, {
            opacity: 0,
            visibility: 'hidden'
        });

        setTimeout(function () {
            this.el.style.display = 'none';
            this.dialogEl.style.display = 'none';
        }.bind(this), parseInt(this.opacityTime))
    },
    okCbHandler: function (e) {
        if (this.okCb) {
            var ret = this.okCb();
            if (ret === false) {
                return
            } else {
                this.hide();
            }
        } else {
            this.hide();
        }
    },
    noCbHandler: function (e) {
        if (this.noCb) {
            var ret = this.noCb();
            if (ret === false) {
                return
            } else {
                this.hide();
            }
        } else {
            this.hide();
        }
    },
    set: function (opt) {
        opt.title && (this.titleEl.innerHTML = opt.title);
        opt.text && (this.textEl.innerHTML = opt.text);
        opt.align && (this.textEl.style.textAlign = opt.align);
        if (opt.ok) {
            this.okCb = opt.okCb;
            this.buttonsEl.innerHTML = '';
            this.okBtn && this.off(this.okBtn, 'click', this.okCbHandler);
            this.okBtn = this.df(this.tpl2replace(this.tpl.button, {name: opt.ok}));
            this.on(this.okBtn, 'click', this.okCbHandler);
            this.buttonsEl.appendChild(this.okBtn);
        }
        if (opt.no) {
            this.noCb = opt.noCb;
            this.noBtn && this.off(this.noBtn, 'click', this.noCbHandler);
            this.noBtn = this.df(this.tpl2replace(this.tpl.button, {name: opt.no}));
            this.on(this.noBtn, 'click', this.noCbHandler);
            this.buttonsEl.appendChild(this.noBtn);
        } else {
            this.okBtn.style.borderRadius = '0 0 7px 7px';
        }
        return this;
    },

    fix: function () {
        this.dialogEl.style.marginTop = -this.dialogEl.offsetHeight / 2 + 'px';
    },
    getCss: function () {
        var s = '\
              div.modal-in{\
                  opacity:1;\
                 visibility:visible;\
                 -webkit-transform:translate3d(0,0,0) scale(1)\
             }\
              div.modal-out{\
                 opacity:0;\
                 visibility:hidden;\
                 -webkit-transform:translate3d(0,0,0) scale(0.815)\
             }\
            .xMsgbox_mask {\
                position: fixed;\
                left: 0;\
                top: 0;\
                height: 100%;\
                width: 100%;\
                text-align: center;\
                color: white;\
                background: RGBA(0, 0, 0, .4);\
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\
                z-index: 999;\
                visibility: hidden;\
                opacity: 0;\
                -webkit-transition-duration: {opacityTime};\
            }\
            .dialog {\
                position: fixed;\
                left: 50%;\
                top: 50%;\
                width: 270px;\
                z-index: 1000;\
                margin-left: -135px;\
                color: black;\
                font-size: 18px;\
                background: white;\
                -webkit-border-radius: 7px;\
                -webkit-transition-duration: {opacityTime};\
                -webkit-transform: translate3d(0,0,0) scale(1.185);\
                opacity: 0;\
                -webkit-transition-property: -webkit-transform,opacity,scale;\
            }\
            .dialog .inner {\
                padding: 15px;\
                border-bottom: 1px solid #b5b5b5;\
                border-radius: 7px 7px 0 0;\
                background: #e8e8e8;\
            }\
            .dialog .title {\
                font-weight: 500;\
                font-size: 18px;\
                text-align: center;\
            }\
            .dialog .text{\
                margin-top: 5px;\
                font-size: 14px;\
                word-wrap: break-word;\
                word-break: break-all;\
            }\
            .dialog .buttons{\
                height: 44px;\
                overflow: hidden;\
                display: -webkit-box;\
                display: -webkit-flex;\
                -webkit-box-pack: center;\
                -webkit-justify-content: center;\
            }\
            .dialog .button{\
                width: 100%;\
                padding: 0 5px;\
                height: 44px;\
                font-size: 17px;\
                line-height: 44px;\
                text-align: center;\
                color: #007aff;\
                background: #e8e8e8;\
                display: block;\
                position: relative;\
                white-space: nowrap;\
                text-overflow: ellipsis;\
                overflow: hidden;\
                cursor: pointer;\
                -webkit-box-sizing: border-box;\
                -moz-box-sizing: border-box;\
                box-sizing: border-box;\
                border-right: 1px solid #b5b5b5;\
                -webkit-box-flex: 1;\
                -ms-flex: 1;\
            }\
            .dialog .button:first-child {\
                border-radius: 0 0 0 7px;\
            }\
            .dialog .button:last-child {\
                border-radius: 0 0 7px 0 ;\
                border-right: none;\
            }';
        return this.tpl2replace(s, {opacityTime: this.opacityTime});
    }
})