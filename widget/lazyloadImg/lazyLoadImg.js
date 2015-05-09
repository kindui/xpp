X.add({
    name: 'LazyLoadImg',
    opt: {
        imgs:[],
        dataName:'lazy',
        throttle:50,
        offset:10,
        onLoad:null
    },
    _init: function () {
        this.imgs = this.$$('img[data-'+this.dataName+']');
        this.length = this.imgs.length || 0;
        this.bindThis(['scroll','render']).computeScreen();
        this.bindEvent();
    },
    computeScreen:function(){
        this.height = window.innerHeight;
    },
    bindEvent:function(){
        this.on(window,'scroll', this.scroll);
        this.on(window,'DOMContentLoaded', this.scroll);
    },
    destroy:function(){
        this.off(window,'scroll', this.scroll);
        this.off(window,'DOMContentLoaded', this.scroll);
    },
    scroll:function(){
       var timmer = null;
        return function(e){
            clearTimeout(timmer);
            timmer = setTimeout(this.render,this.throttle);
        };
    }(),
    render:function(){
        this.imgs.forEach(function(img,index){
            if(this.isInView(img)){
                var lazySrc = img.dataset[this.dataName];
                if(lazySrc){
                    img.src = lazySrc;
                    img.removeAttribute('data-'+this.dataName);
                    img.onload = function(){
                        this.onLoad && this.onLoad.call(this,img);
                    }.bind(this)
                    this.imgs.splice(index,1);
                }
            }
        }.bind(this));
    },
    isInView: function (el) {
        var pos = el.getBoundingClientRect();
        if(pos.bottom + this.offset > 0 && pos.top - this.offset < this.height ){
             return true;
        }
        return false;
    }
});