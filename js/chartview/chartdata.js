/**
 * Created by leiting on 14/9/16.
 * 数据处理接口
 */
(function (arg) {

    var self = arg;

    /**
     * 仪表盘统一数据对象，通过不同的chartOption来获取不同类型仪表盘的数据格式
     * @param option
     */
    var chartData = function (option) {
        this.chartOption = option;
    };

    var fn = chartData.prototype;

    /**
     * 获取配置参数
     * @returns {*}
     */
    fn.getchartOption = function () {
        return this.chartOption;
    };

    /**
     * 设置配置参数
     * @param option
     */
    fn.setchartOption = function (option) {
        this.chartOption = option;
    };

    /**
     * 存储数据源的对象，来获取不同类型图标的数据源
     * @type {{}}
     */
    fn.DataSource = {};

    fn.DataSource.AREA = function () {

    };

    fn.DataSource.BAR = function () {

    };

    fn.DataSource.HBAR = function () {

    };

    fn.DataSource.CICLE = function () {

        //随机生成环状图的数据
        var temppiepdataset = [];
        var temppiepsub1 = Math.floor(Math.random() * 100);
        var temppiepsub2 = 100 - temppiepsub1;
        temppiepdataset.push(temppiepsub1);
        temppiepdataset.push(temppiepsub2);

        return temppiepdataset;

    };

    fn.DataSource.DASHBOARD = function () {

    };

    fn.DataSource.FUNNEL = function () {

    };

    fn.DataSource.LINE = function () {

    };

    fn.DataSource.PIE = function () {

    };

    fn.DataSource.RADAR = function () {

    };

    fn.DataSource.SCATTER = function () {

    };

    fn.DataSource.NUMBER = function () {

    };

    /**
     * 外部通过统一接口来调用不同类型图表数据源，根据chartOption.chartCate来确定调用
     * @returns {*}
     */
    fn.getData = function () {
        var _this = this;

        var chartCate = _this.chartOption.chartCate;

        return _this.DataSource[chartCate](_this.chartOption);
    };


    /**
     * 返回数据源对象的实例
     * @param option
     * @returns {chartData}
     */
    var getInstance = function (option) {

        return new chartData(option);
    };

    self.getChartDataModel = getInstance;

})(nameSpace.reg("dashboard.data"));