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
/**
 * Created by leiting on 14/9/16.
 */
(function (arg) {

    var self = arg;

    var instanceCategory = {};

    instanceCategory.AREA = function () {

    };
    instanceCategory.BAR = function () {

    };
    instanceCategory.HBAR = function () {

    };
    instanceCategory.CICLE = function () {

        var cicle = new upiep();
        cicle.setCircle(false);//是否生成圆环
        cicle.setType(0);
        cicle.setIcon(false);
        return cicle;

    };
    instanceCategory.DASHBOARD = function () {

    };
    instanceCategory.FUNNEL = function () {

    };
    instanceCategory.LINE = function () {

    };
    instanceCategory.PIE = function () {

    };
    instanceCategory.RADAR = function () {

    };
    instanceCategory.SCATTER = function () {

    };
    instanceCategory.NUMBER = function () {

    };

    var getInstance = function (option) {
        return instanceCategory[option.chartCate](option);
    };

    self.getChartInstance = getInstance;

})(nameSpace.reg("dashboard"));
/**
 * Created by leiting on 14/9/16.
 */
(function (arg) {

    var self = arg;

    /**
     * chartView对象
     * @param mxCelllist
     */
    var chartView = function (mxCelllist,graph) {
        this.mxCelllist = mxCelllist;
        this.graph = graph;
    };

    var fn = chartView.prototype;

    /**
     * 获取mxCell的配置参数，这些配置参数即是图表的配置参数
     * @param mxCell
     * @returns {*}
     */
    fn.getchartOption = function (mxCell) {
        if(mxCell){
            var chartOptions = mxCell.getAttribute("chartOptions",null);
            if(chartOptions){
                return eval("("+chartOptions+")");
            }
        }
        return null;
    };

    fn.getFullChartOption = function (mxCell) {
        if(mxCell){
            var chartOptions = this.getchartOption(mxCell);
            if(chartOptions){
                var chartCate = this.getChartCate(mxCell);
                var chartWidth = this.getChartWidth(mxCell);
                var chartHeight = this.getChartHeight(mxCell);
                var chartContanierId = this.getChartContanierId(mxCell);
                chartOptions.chartCate = chartCate;
                chartOptions.chartWidth = chartWidth;
                chartOptions.chartHeight = chartHeight - 25;
                chartOptions.chartContanierHeight = chartHeight;
                chartOptions.chartContanierId = chartContanierId;

                return chartOptions;
            }
        }
        return null;
    };

    /**
     * 获取图表的高度
     * @param mxCell
     * @returns {*}
     */
    fn.getChartHeight = function (mxCell) {
        if(mxCell){
            var height = mxCell.getGeometry().height;
            return height;
        }
        return null;
    };

    /**
     * 获取图表的宽度
     * @param mxCell
     * @returns {*}
     */
    fn.getChartWidth = function (mxCell) {
        if(mxCell){
            var width = mxCell.getGeometry().width;
            return width;
        }
        return null;
    };

    /**
     * 获取图表将来要防止的div容器的id，为了画容器做准备
     * @param mxCell
     * @returns {*}
     */
    fn.getChartContanierId = function (mxCell) {
        if(mxCell){

            var tempId = mxCell.getId().substr(6);
            if(tempId){
                return "chartcontanier_" + tempId;
            }
        }
        return null;
     };

    fn.getChartCate = function (mxCell) {
        if(mxCell){
            var chartCate = mxCell.getAttribute("chartcate",null);
            if(chartCate){
                return chartCate;
            }
        }
        return null;
    };

    /**
     * 获取创建模板时所需要的参数字典，包含：宽、高、标题、容器ID等
     * @param mxCell
     * @returns {*}
     */
    fn.getTemplatedict = function (mxCell) {

        if(mxCell){
            var dict = {};

            var chartOptions = this.getchartOption(mxCell);
            var chartWidth = this.getChartWidth(mxCell);
            var chartHeight = this.getChartHeight(mxCell);
            var chartContanierId = this.getChartContanierId(mxCell);

            dict.chartWidth = chartWidth;
            dict.chartHeight = chartHeight - 25;
            dict.chartContanierHeight = chartHeight;
            dict.chartContanierId = chartContanierId;
            if(chartOptions){
                var chartTitle = chartOptions.chartTitle;
                if(chartTitle){
                    dict.chartTitle = chartTitle;
                }
            }
            return dict;
        }
        return null;
    };

    /**
     * 通过URL获取模板html文件
     * @param mxCell
     */
    fn.getTemplate = function (mxCell) {
        //获取相关参数
        var html = "";
        var chartOptions = this.getchartOption(mxCell);
        var chartTemplate = chartOptions.chartTemplate;
        if(chartTemplate){

            var dict = this.getTemplatedict(mxCell);
            html = dashboard.utils.compileTemplate(chartTemplate + ".html",dict);

        }
        return html;
    };

    /**
     * 获取预览时的模板html文件
     */
    fn.getPreviewTemplate = function (templateName,chartContanierId,chartTitle) {
        var html = "";

        var dict = {
            chartWidth: 258,
            chartHeight: 230,
            chartContanierHeight: 258
        };
        if(chartContanierId){
            dict.chartContanierId = chartContanierId;
        }
        if(chartTitle){
            dict.chartTitle = chartTitle;
        }

        html = dashboard.utils.compileTemplate(templateName + ".html",dict);

        return html;
    };

    /**
     * 获取仪表盘实例，通过mxCell的chartCate进行实例化,需要先实例化绑定到节点的数据模型
     */
    fn.bindChartInstance = function (mxCell) {
        var fullChartOptions = this.getFullChartOption(mxCell);
        if(fullChartOptions){
            var chartInstance = dashboard.getChartInstance(fullChartOptions);
            var updateInterval = function (chartInstance) {
                setInterval(function () {
                    chartInstance.update(mxCell.chartDataModel.getData());
                },fullChartOptions.chartRefreshInterval*1000)
            };
            chartInstance.updateInterval = updateInterval;
            mxCell.chartInstance = chartInstance;
        }
    };

    /**
     * 获取预览视图的图表实例
     * @param chartOptions
     * @returns {*}
     */
    fn.getPreviewChartInstance = function (chartOptions,chartDataModel) {
        if(chartOptions){
            var chartInstance = dashboard.getChartInstance(chartOptions);
            var updateInterval = function (chartInstance) {
                setInterval(function () {
                    chartInstance.update(chartDataModel.getData());
                },chartOptions.chartRefreshInterval*1000)
            };
            chartInstance.updateInterval = updateInterval;
            return chartInstance;
        }
    };

    /**
     * 获取数据模型实例，根据不同类型的图表，获取实例后绑定到mxCell中。
     * 需要先绑定数据模型后再绑定图表实例，否则无法读取数据
     * @param mxCell
     * @returns {*}
     */
    fn.bindChartDataModel = function (mxCell) {
        var fullChartOptions = this.getFullChartOption(mxCell);
        if(fullChartOptions){
            var chartDataModel = dashboard.data.getChartDataModel(fullChartOptions);

            mxCell.chartDataModel = chartDataModel;
        }
    };

    /**
     * 获取预览数据模型
     * @param options
     * @returns {*}
     */
    fn.getPreviewDataModel = function (chartOptions) {
        if(chartOptions){
            var chartDataModel = dashboard.data.getChartDataModel(chartOptions);
            return chartDataModel;
        }
    };

    /**
     * chartView的相关方法执行全部封装在这个接口中，外部只要调用此接口即可执行
     */
    fn.excute = function () {
        if(this.mxCelllist.length > 0){
            clearInterval();
            for(var i = 0 ; i < this.mxCelllist.length ; i++){
                var mxCell = this.mxCelllist[i];
                var chartOptions = this.getFullChartOption(mxCell);
                this.bindChartDataModel(mxCell);
                this.bindChartInstance(mxCell);
                mxCell.chartInstance.bindData(mxCell.chartDataModel.getData());
                mxCell.chartInstance.setSize(chartOptions.chartWidth,(chartOptions.chartHeight - 25));

                var templatehtml = this.getTemplate(mxCell);
                console.log(templatehtml);

                var htmlStyle = "html=1;strokeColor=none;fillColor=none";
                mxCell.setStyle(htmlStyle);
                mxCell.setValue(templatehtml);
                this.graph.refresh(mxCell);

                mxCell.chartInstance.createRender("id",chartOptions.chartContanierId);
                mxCell.chartInstance.draw();
                if(chartOptions.chartonTimeCheck && chartOptions.chartRefreshInterval > 0){
                    mxCell.chartInstance.updateInterval(mxCell.chartInstance);
                }
            }
        }
    };

    /**
     * 获取chartView新实例
     * @param mxCelllist
     * @returns {chartView}
     */
    var getInstance = function (mxCelllist,graph) {

        return new chartView(mxCelllist,graph);
    };

    self.getChartView = getInstance;

})(nameSpace.reg("dashboard"));