/*!
 * dashboard - JS for Debug
 * @licence dashboard - v0.1.0 (2014-09-17)
 */
/**
 * Created by leiting on 14/9/12.
 */
(function (arg) {

    var self = arg;

    //定义config对象
    var config = {
        IMAGEPATH: "images/",
        TEMPLATES_DIR: "template",	// 缓存目录
        TEMPLATES_ISCACHE: true,			// 缓存开启
        SLIDEBAR: {
            iconurl: "images/charticon/",
            slideitem_height: 40,
            slideitem_width: 40,
            instanceitem_height: 200,
            instanceitem_width: 200,
            dragwidth: 40,
            dragheight: 40
        }
    };

    /**
     * 通过key获取config的某项内容
     * @param k
     * @returns {*} 配置内容的对象
     */
    config.getItemByKey = function (k) {
        return config[k];
    };

    self.config = config;

})(nameSpace.reg("dashboard"));
/**
 * Created by leiting on 14/9/11.
 */
(function (arg) {

    var self = arg;
    var config = dashboard.config;
    var utils = {};
    var templateCache = {};
    /***
     * 返回guid
     * @param s
     * @returns {string}
     */
    utils.getGUID = function (s) {
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        if(s){
            guid = s + "_" + guid;
        }

        return guid;
    };

    utils.getMD5String = function (s) {
        if(s){
            return md5(s);
        }
        return null;
    };

    utils.compileTemplate = function (templateUrl, dict, func) {
        var template = "",
            url = "",
            result = "",
            html = "",
            key = "";

        url = templateUrl.charAt(1) === "/" ?  templateUrl : "/" + templateUrl;
        url = "dashboard/" + config.TEMPLATES_DIR + url;
        key = md5(url);

        if(config.TEMPLATES_ISCACHE && (key in templateCache) ){
            template = templateCache[key];
        }else{
            result = $.ajax({ url: url, async: false });
            if( result.readyState === 4 &&  result.status === 200  ){
                template = $.trim(result.responseText);
                if(config.TEMPLATES_ISCACHE){
                    templateCache[key] = template;
                }
            }else{
                throw new Error(result.statusText);
            }
        }
        html = Handlebars.compile(template)(dict);
        if(typeof func === "function"){
            func(html);
        }

        return html;
    };

    self.utils = utils;

})(nameSpace.reg("dashboard"));
/**
 * Created by leiting on 14/9/11.
 */
(function (arg) {

    var self = arg;

    //定义左侧仪表盘列表数据集对象
    var slidebardata = {};
    //数据集，iconname是确定每个仪表盘对象的显示图标，左侧显示图标例子：area.svg，实例化后的默认图标：area_i.svg
    //本地配置数据，此数据也可以从后台进行获取
    slidebardata.data = [
        {
            uchartcate: "AREA",
            uchartname: "面积图",
            iconname: "area"
        },
        {
            uchartcate: "BAR",
            uchartname: "柱状图",
            iconname: "bar"
        },
        {
            uchartcate: "HBAR",
            uchartname: "柱状图",
            iconname: "hbar"
        },
        {
            uchartcate: "CICLE",
            uchartname: "环形图",
            iconname: "cicle"
        },
        {
            uchartcate: "DASHBOARD",
            uchartname: "仪表盘",
            iconname: "dashboard"
        },
        {
            uchartcate: "FUNNEL",
            uchartname: "锥形图",
            iconname: "funnel"
        },
        {
            uchartcate: "LINE",
            uchartname: "折线图",
            iconname: "line"
        },
        {
            uchartcate: "PIE",
            uchartname: "饼图",
            iconname: "pie"
        },
        {
            uchartcate: "RADAR",
            uchartname: "雷达图",
            iconname: "radar"
        },
        {
            uchartcate: "SCATTER",
            uchartname: "散点图",
            iconname: "scatter"
        },{
            uchartcate: "NUMBER",
            uchartname: "数字图",
            iconname: "number"
        }];

    /***
     * 获取slidebardata的对象数据集
     * @returns {Array} 返回slidebar对象数据集
     */
    slidebardata.getData = function () {
        if(slidebardata.data){
            return slidebardata.data;
        }
    };

    /**
     * 同步方式获取外部数据
     * @param fn
     */
    slidebardata.addRemoteDataSync = function (fn) {
        var d = fn();
        slidebardata.data = d;
        return slidebardata.data;
    };

    /**
     * 异步方式获取外部数据
     * @param fn
     */
    slidebardata.addRemoteDataAsync = function (fn) {
        fn(function (d) {
            slidebardata.data = d;
            return slidebardata.data;
        });
    };

    /***
     * 向slidebardata的data数据集中增加slidebar的仪表盘对象
     * @param obj slidebar的仪表盘对象
     */
    slidebardata.addData = function (obj) {
        slidebardata.data.push(obj);
    };

    /***
     * 删除slidebardata的data数据集中所有数据
     */
    slidebardata.removeAll = function () {
        slidebardata.data = [];
    };

    self.slidebardata = slidebardata;
})(nameSpace.reg("dashboard.slidebar"));
/**
 * Created by leiting on 14/9/11.
 * 定义左侧工具bar的对象中的每一项可被拖动的组件
 */
(function (arg) {

    var self = arg;
    var utils = dashboard.utils;
    var config = dashboard.config;
    /**
     * 仪表盘左侧拖拽工具栏每个工具项对象的构造函数
     * @param slidebar 父容器对象
     * @param data 该对象的驱动数据
     */
    var slidebaritem = function (slidebar,data) {
        this.slidebar = slidebar;
        this.data = data;
        this.config = config.getItemByKey("SLIDEBAR");
        this.height = 40;
        this.width = 40;
        this.instanceHeight = 300;
        this.instanceWidth = 300;
        this.itemId = null;
        this.iconUrl = null;
        this.instanceUrl = null;
        this.chartName = "";
        this.chartCate = "";
        this.isTitle = false;
        this.itemContanier = null;
    };

    var fn = slidebaritem.prototype;

    /**
     * 初始化参数
     */
    fn.init = function () {
        this.height = this.config.slideitem_height;
        this.width = this.config.slideitem_width;
        this.instanceHeight = this.config.instanceitem_height;
        this.instanceWidth = this.config.instanceitem_width;
        this.iconUrl = "dashboard/" + this.config.iconurl + this.data.iconname + ".svg";
        this.instanceUrl = "dashboard/" + this.config.iconurl + this.data.iconname + "_i.svg";
        this.chartName = this.data.uchartname;
        this.chartCate = this.data.uchartcate;
        this.itemId = utils.getGUID();
    };

    fn.showTitle = function (t) {
        if(typeof t === "boolean"){
            this.isTitle = t;
        }
    };

    /**
     * 返回工具项的容器，为后续绑定drag事件做准备
     * @returns {*}
     */
    fn.getItemContanier = function () {
        if(this.itemContanier){
            return this.itemContanier;
        }
        return null;
    };

    /**
     * 获取图表实例的唯一ID，每次都不同
     * @returns {string}
     */
    fn.getChartGUID = function () {
        return utils.getGUID();
    };

    /**
     * 创建工具栏项对象
     */
    fn.createBarItem = function () {
        var self = this;
        self.init();

        //创建容器
        var contanier = document.createElement("div");
        contanier.style.width = this.width + "px";
        contanier.style.margin = "3px";
        contanier.style.float = "left";
        contanier.style.cursor = "pointer";
        contanier.setAttribute("charttype","1");

        //创建icon图片对象
        var img = document.createElement("img");
        img.style.width = this.width + "px";
        img.style.height = this.height + "px";
        img.style.border = "0px";
        img.src = this.iconUrl;

        //创建下部title
        var title = document.createElement("div");
        title.style.width = this.width + "px";
        title.style.padding = "2px";
        title.style.textAlign = "center";
        title.innerHTML = this.chartName;

        contanier.appendChild(img);
        if(this.isTitle){
            contanier.appendChild(title);
        }

        this.itemContanier = contanier;

        graph.onlineEdit.createDragSource(contanier,
            graph.onlineEdit.createChartDropHandler(contanier,true,{cc:contanier,type: "chart"},self),
            graph.onlineEdit.createDragPreview(40,40));

        return contanier;
    };



    self.slidebaritem = slidebaritem;
})(nameSpace.reg("dashboard.slidebar"));
/**
 * Created by leiting on 14/9/11.
 * 定义slidebar的框架，框架内可以包含多个baritem
 */

(function (arg) {

    var self = arg;
    var slidebardata = dashboard.slidebar.slidebardata;
    var utils = dashboard.utils;
    var slidebaritem = dashboard.slidebar.slidebaritem;

    /***
     * slidebar 构造函数
     * @param render
     */
    var slidebar = function (render) {
        this.barItems = [];
        this.bardata = null;
        this.render = render;
        this.renderobj = null;
        this.height = 0;
        this.width = 0;
    };

    var fn = slidebar.prototype;

    /***
     * 初始化slidebar框架对象
     */
    fn.init = function () {
        var self = this;
        this.bardata = slidebardata.getData();
        this.renderobj = document.getElementById(this.render);
        this.height = this.renderobj.offsetHeight;
        this.width = this.renderobj.offsetWidth;
        self.initBarItems();
        self.drawBarItems();

    };

    fn.initBarItems = function () {
        var self = this;
        if(this.bardata.length > 0){
            for(var i = 0 ; i < this.bardata.length ; i++){
                var barItem = new slidebaritem(this,this.bardata[i]);
                this.barItems.push(barItem);
            }
        }
    };

    fn.drawBarItems = function () {
        var barItems = this.barItems;
        if(barItems){
            for(var i = 0 ; i < barItems.length ; i++){
                var o = barItems[i].createBarItem();
                this.renderobj.appendChild(o);
            }
        }
    };


    /***
     * 返回slidebar中的所有baritem
     * @returns {null|*}
     */
    fn.getSlidebarItems = function () {
        return this.barItems;
    };

    self.slidebar = slidebar;
})(nameSpace.reg("dashboard.slidebar"));