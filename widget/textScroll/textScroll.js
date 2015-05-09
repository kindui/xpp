X.add({
    name:'TextScroll',
    opt:{
        totalTime:5,
        stopFrame:10
    },
    _init:function(){
        this.elUl = this.$('ul', this.el);
        this.elLis = this.$$('li', this.el);
        this.liHeight = this.elLis[0].offsetHeight;
        this.actionCount = this.elLis.length;
        this.animationName = 'scrollLi_' + String(Math.random()).slice(2, 10);
        this.compute();
    },
    compute:function(){
        var stopFrame = this.stopFrame;
        var duringFrame = (100 - this.actionCount * this.stopFrame) / (this.actionCount - 1);
        var addStepFrame = duringFrame + stopFrame;
        var animationText = '@-webkit-keyframes ' + this.animationName + '{';
        var initPct = 0;
        for(var i = 0, len = this.actionCount; i < len; i++){
            var height = i * this.liHeight;
            var head = initPct + '%,' + (initPct + stopFrame) + '%' + '{-webkit-transform:translate3d(0, -' + height + 'px, 0); }';
            initPct = initPct + addStepFrame;
            animationText += head;
        }
        animationText += '}';
        animationText += this.elStr + ' ul{ -webkit-animation:' + this.animationName + ' ' + this.totalTime + 's ease infinite both; }';
        this.addStyle(animationText);
    }
});