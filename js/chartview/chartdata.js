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

    fn.DataSource.AREA = function (option) {

    };

    fn.DataSource.BAR = function (option) {
        var dataset  = [{
            "name":"IBM",
            "value":Math.floor(Math.random() * 20)
        },{
            "name":"BMC",
            "value":Math.floor(Math.random() * 20)
        },{
            "name":"Oracle",
            "value":Math.floor(Math.random() * 20)
        },{
            "name":"HP",
            "value":Math.floor(Math.random() * 20)
        },{
            "name":"CISCO",
            "value":Math.floor(Math.random() * 20)
        }];

        return dataset;
    };

    fn.DataSource.HBAR = function (option) {
        var dataset  = [{
            "name":"IBM",
            "value":Math.floor(Math.random() * 20)
        },{
            "name":"BMC",
            "value":Math.floor(Math.random() * 20)
        },{
            "name":"Oracle",
            "value":Math.floor(Math.random() * 20)
        }];

        return dataset;
    };

    fn.DataSource.CICLE = function (option) {

        //随机生成环状图的数据
        var dataset = [];
        var temppiepsub1 = Math.floor(Math.random() * 100);
        var temppiepsub2 = 100 - temppiepsub1;
        dataset.push(temppiepsub1);
        dataset.push(temppiepsub2);

        return dataset;

    };

    fn.DataSource.DASHBOARD = function (option) {

    };

    fn.DataSource.FUNNEL = function (option) {

    };

    fn.DataSource.LINE = function (option) {
        var dataset = [{
            "name":"北京",
            "values":[{
                "date":"2011-10-01 12:48:01",
                "value":23.1
            },{
                "date":"2011-10-01 12:48:02",
                "value":24.1
            },{
                "date":"2011-10-01 12:48:03",
                "value":43.3
            },{
                "date":"2011-10-01 12:48:04",
                "value":23.5
            },{
                "date":"2011-10-01 12:48:05",
                "value":45.1
            },{
                "date":"2011-10-01 12:48:06",
                "value":27.1
            },{
                "date":"2011-10-01 12:48:07",
                "value":42.1
            },{
                "date":"2011-10-01 12:48:08",
                "value":26.1
            }]
        }];

        return dataset;
    };

    fn.DataSource.PIE = function (option) {
        var dataset  = [{
            "name":"IBM",
            "value":Math.floor(Math.random() * 20)
        },{
            "name":"BMC",
            "value":Math.floor(Math.random() * 20)
        },{
            "name":"Oracle",
            "value":Math.floor(Math.random() * 20)
        },{
            "name":"HP",
            "value":Math.floor(Math.random() * 20)
        },{
            "name":"CISCO",
            "value":Math.floor(Math.random() * 20)
        }];

        return dataset;
    };

    fn.DataSource.RADAR = function (option) {
        var dataset = [
            {
                'name':'Smartphone',
                'value':[
                    {axis:"Email",value:0.59},
                    {axis:"Social Networks",value:0.56},
                    {axis:"Internet Banking",value:0.42},
                    {axis:"News Sportsites",value:0.34},
                    {axis:"Search Engine",value:0.48},
                    {axis:"View Shopping sites",value:0.14},
                    {axis:"Paying Online",value:0.11}
                ]

            },{
                'name':'Tablet',
                'value':[
                    {axis:"Email",value:0.48},
                    {axis:"Social Networks",value:0.41},
                    {axis:"Internet Banking",value:0.27},
                    {axis:"News Sportsites",value:0.28},
                    {axis:"Search Engine",value:0.46},
                    {axis:"View Shopping sites",value:0.29},
                    {axis:"Paying Online",value:0.11}
                ]
            }

        ];

        return dataset;
    };

    fn.DataSource.SCATTER = function (option) {

    };

    fn.DataSource.NUMBER = function (option) {
        var dataset = [Math.floor(Math.random() * 9),Math.floor(Math.random() * 9),Math.floor(Math.random() * 9),
            Math.floor(Math.random() * 9)];

        return dataset;
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