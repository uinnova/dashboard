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