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