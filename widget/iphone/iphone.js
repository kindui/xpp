//iphone测试框架, human 2014-7-2
(function () {
    window.iphones = {};
    window.iphone = {
        add: add
    }
    function TEXT(fn) {
        return fn.toString().match(/\/\*([\s\S]*?)\*\//)[1];
    }

    function df(str) {
        var div = document.createElement('div');
        div.innerHTML = str;
        return div.firstElementChild;
    }

    var htmlFragment = TEXT(function () {
        /*
         <div class="simu" id="{name}">
         <div class="simu_header"></div>
         <div class="simu_body">
         <iframe src="{url}" name="{name}" width="320px" height="480px" scrolling="yes" frameborder="0"></iframe>
         </div>
         <div class="simu_footer"></div>
         <div class=qr_code></div>
         </div>
         */
    });
    var initStyle = TEXT(function () {
        /*

         .simu, .simu *{
         -webkit-box-sizing :border-box;
         color:#fff;
         }

         .simu{
         position:relative;
         float: left;
         margin: 5px;
         width                 :340px;
         border                :1px solid black;
         -webkit-border-radius :30px;
         }

         .simu_header{
         position              :relative;
         background            :black;
         height                :60px;
         border-top            :1px solid black;
         -webkit-border-radius :30px 30px 0 0;
         text-align:           center;
         color:                white;
         padding-top: 10px;
         }

         .simu_header:before{
         content: '';
         position: absolute;
         top: 70%;
         left: 50%;
         width: 70px;
         height: 10px;
         margin-top: -5px;
         background: #000;
         margin-left: -35px;
         border: 2px solid gray;
         border-radius: 5px;
         }

         .simu_body{
         border :10px solid #000;
         }

         .simu_footer{
         position              :relative;
         background            :black;
         height                :60px;
         border-bottom         :1px solid black;
         -webkit-border-radius :0 0 30px 30px;
         }

         .simu_footer::before{
         content       :'';
         position      :absolute;
         top           :50%;
         left          :50%;
         width         :50px;
         height        :50px;
         margin-top    :-25px;
         background    :#000;
         margin-left   :-25px;
         border        :1px solid gray;
         border-radius :40px;
         }

         .simu_footer:after{
         content       :'';
         position      :absolute;
         top           :50%;
         left          :50%;
         width         :20px;
         height        :20px;
         margin-top    :-10px;
         margin-left   :-10px;
         border        :1px solid #fff;
         border-radius :5px;
         }
         .simu .qr_code{
         position: absolute;
         visibility:hidden;
         left: 50%;
         top: 50%;
         width: 150px;
         height: 150px;
         border: 1px solid black;
         margin-top: -75px;
         margin-left: -75px;
         z-index: 2;
         }
         */
    });

    function addStyle(styleStr, doc) {
        doc = doc || document;
        var style = doc.createElement('style');
        style.type = 'text/css';
        style.appendChild(doc.createTextNode(styleStr));
        doc.getElementsByTagName('HEAD')[0].appendChild(style);
    }

    function add(url, title, callback) {
        if (typeof(title) == 'function') {
            callback = title;
            title = '';
        }

        var frameName = createRandomName();
        iphones[frameName] = {
            url: url,
            title: title
        }
        addHTML2Doc(url, title, frameName);

        window.frames[frameName].onload = function () {
            var doc = frames[frameName].document;
            var styleStr = '\
            body{cursor:pointer;}\
                .iphone_mask{\
                position: fixed;\
                left: 0;\
                top: 0;\
                width: 100%;\
                height: 100%;\
                background: rgba(0,0,0,0.3);\
                z-index: 10000;\
            }';
            addStyle(styleStr, doc);
            callback && callback(frameName);
        }
        return this;
    }

    function addHTML2Doc(url, title, frameName) {
        var htmlCodeDF = df(htmlFragment.replace(/{url}/g, url).replace(/{name}/g, frameName, 'g'));
        document.body.appendChild(htmlCodeDF);

        var qrCodeEl = htmlCodeDF.querySelector('.qr_code');

        var qrcode = new QRCode(qrCodeEl, {
            width: 150,
            height: 150
        });
        htmlCodeDF.querySelector('.simu_footer').onclick = function (e) {
            var switcher = true;
            return function(){
                createQrCode(qrCodeEl, qrcode, frameName, switcher);
                switcher = !switcher;
            }
        }();
        htmlCodeDF.querySelector('.simu_header').textContent = title || '';
    }

    function createQrCode(el, qrcode, frameName, switcher) {

        qrcode.makeCode(window.frames[frameName].location.href);
        var doc = window.frames[frameName].document;
        var mask = doc.querySelector('.iphone_mask');
        if(switcher){
            if(mask){
                doc.body.style.webkitFilter = 'blur(2px)';
                mask.style.visibility='visible';
            }else{
                mask = df('<div class="iphone_mask"></div>');
                doc.body.appendChild(mask);
                doc.body.style.webkitFilter = 'blur(2px)';
            }
        }else{
            mask.style.visibility='hidden';
            doc.body.style.webkitFilter = null;
        }
        var val = switcher ? 'visible' : 'hidden';
        el.style.visibility = val;
    }

    function createRandomName() {
        var seed = String(Math.random()).slice(2, 7);
        return 'iphone_' + seed;
    }

    function _init() {
        addStyle(initStyle);
    }

    _init();
})();