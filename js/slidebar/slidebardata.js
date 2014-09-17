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