/*!
 * dashboard - JS for Debug
 * @licence dashboard - v0.1.0 (2014-09-18)
 */
/**
 * Created by leiting on 14/9/15.
 */
(function (arg) {

    var self = arg;

    /**
     * 初始化仪表盘配置页面数据
     * @param op chartOptions
     */
    var initConfigPage = function (op) {

        var chartOptions = {};

        //注册X轴选中
        Handlebars.registerHelper("chartConfigxAxis", function (chartxAxisCheck) {
            if(chartxAxisCheck){
                return new Handlebars.SafeString("<input type='checkbox' class='uchart_setting_attr_checkbox' checked='checked' id='chartxaxis'>");
            }else{
                return new Handlebars.SafeString("<input type='checkbox' class='uchart_setting_attr_checkbox' id='chartxaxis'>");
            }
        });

        //注册Y轴选中
        Handlebars.registerHelper("chartConfigyAxis", function (chartyAxisCheck) {
            if(chartyAxisCheck){
                return new Handlebars.SafeString("<input type='checkbox' class='uchart_setting_attr_checkbox' checked='checked' id='chartyaxis'>");
            }else{
                return new Handlebars.SafeString("<input type='checkbox' class='uchart_setting_attr_checkbox' id='chartyaxis'>");
            }
        });

        //注册实时选中
        Handlebars.registerHelper("chartDataTypeonTime", function (chartonTimeCheck) {
            if(chartonTimeCheck){
                return new Handlebars.SafeString("实时&nbsp;&nbsp;<input type='checkbox' id='chartdatatype_ontime' checked='checked' class='uchart_setting_attr_checkbox'>&nbsp;&nbsp;");
            }else{
                return new Handlebars.SafeString("实时&nbsp;&nbsp;<input type='checkbox' id='chartdatatype_ontime' class='uchart_setting_attr_checkbox'>&nbsp;&nbsp;");
            }
        });

        //注册历史选中
        Handlebars.registerHelper("chartDataTypeHistory", function (chartHistoryCheck) {
            if(chartHistoryCheck){
                return new Handlebars.SafeString("历史&nbsp;&nbsp;<input type='checkbox' id='chartdatatype_history' checked='checked' class='uchart_setting_attr_checkbox'>");
            }else{
                return new Handlebars.SafeString("历史&nbsp;&nbsp;<input type='checkbox' id='chartdatatype_history' class='uchart_setting_attr_checkbox'>");
            }
        });

        //如果仪表盘配置数据存在，则初始化页面
        if(op){

            chartOptions = eval("("+op+")");


        }
        var html = dashboard.utils.compileTemplate("chartsetting.html",chartOptions);

        return html;
    };

    var runSetting = function (editorobj,cell,graphobj) {

        var html = null;
        var kpiResult = "";
        var kpiRelCIResult = [];
        //获取cell原有设置的值
        var chartOptions = cell.getAttribute("chartOptions",null);
        var chartOptionsobj = {};
        //将cell的设置option转换成对象
        if(chartOptions){
            chartOptionsobj = eval("("+chartOptions+")");
        }
        //获取cell的仪表盘所属类型
        var chartCate = cell.getAttribute("chartcate",null);

        var kpiData = [{id:"CPU利用率",text:"CPU利用率"},{id:"内存利用率",text:"内存利用率"}];

        var kpiRelCIData = [{id:"网银主机",text:"网银主机"},{id:"结算主机",text:"结算主机"},{id:"第三方主机",text:"第三方主机"}];

        if(chartOptionsobj){
            //申明变量用于保存KPI名称
            kpiResult = chartOptionsobj.chartDatasourceKPI;
            //申明变量用于保存KPI所关联的CI唯一建
            kpiRelCIResult = chartOptionsobj.chartDatasourcehost;

        }
        //初始化页面
        html = initConfigPage(chartOptions);


        var dialog = graphobj.dialog("仪表盘配置",html, function (el) {

            var error = [],
                result = null,
                obj = {};

            if($("#chartdatatype_ontime").attr("checked") && !/\d+/g.test($("#chartrefresh").val())){
                error.push("刷新时间：必须为数字");
            }

            if($("#chartOffset").val() && !/\d+/g.test($("#chartOffset").val())){
                error.push("边距：必须为数字");
            }

            if( !kpiResult ){
                error.push("KPI必须选择");
            }

            if( kpiRelCIResult && !(kpiRelCIResult.length > 0)){
                error.push("CI必须选择至少一项");
            }

            if( !kpiRelCIResult ){
                error.push("CI必须选择至少一项");
            }

            //判断选择历史后是否填写了小时和分钟，如果都没有填写则不通过
            if($("#chartdatatype_history").attr("checked")){
                if((!$("#chartdatehour").val() && !$("#chartdatemin").val())){

                    error.push("选择历史后，小时和分钟至少填写一项大于0的数字");
                }
                if($("#chartdatehour").val() && !/\d+/g.test($("#chartdatehour").val())){
                    error.push("小时必须为数字");
                }

                if($("#chartdatemin").val() && !/\d+/g.test($("#chartdatemin").val())){
                    error.push("分钟必须为数字");
                }

                if((!$("#chartdatehour").val() || $("#chartdatehour").val() == 0) && $("#chartdatemin").val() <= 0){
                    error.push("小时分钟不能同时为0")
                }

                if((!$("#chartdatemin").val() || $("#chartdatemin").val() == 0) && $("#chartdatehour").val() <= 0){
                    error.push("小时分钟不能同时为0")
                }
            }

            if(error.length === 0){
                cell.setAttribute("chartOptions",getResultOptions());
                editorobj.graph.refresh(cell);
                graphobj.utils.alert("配置已更新");
                dialog.hide();
            }else{
                graphobj.utils.alert(error.join("\r\n"));
            }
        });

        /**
         * 此段落主要给KPI及选择CI进行初始化
         */
        //初始化KPI下拉菜单
        $("#chartDatasourceKPI").val(kpiResult).select2({
            data: kpiData,
            placeholder: "请点选KPI",
            allowClear: true
        });

        //如果已经选择了KPI则初始化主机下拉菜单
        if(kpiResult){
            $("#chartDatasourcehost").val(kpiRelCIResult).select2({
                data: kpiRelCIData,
                placeholder: "请点选KPI",
                allowClear: true,
                multiple: true
            });
        };

        //当选择KPI，初始化主机下拉菜单,并给kpiResult赋值
        //如果是清空KPI，则清空保存的对应值及主机对应的结果值
        $("#chartDatasourceKPI").on("change", function (e) {
            if(e.val){
                kpiResult = e.val;
                if(kpiResult){
                    $("#chartDatasourcehost").val(kpiRelCIResult).select2({
                        data: kpiRelCIData,
                        placeholder: "请点选KPI",
                        allowClear: true,
                        multiple: true
                    });
                }
            }else{
                $("#chartDatasourcehost").val([]).select2({
                    data: [],
                    placeholder: "请点选KPI",
                    allowClear: true,
                    multiple: true
                });
                kpiResult = "";
                kpiRelCIResult = [];
            }
        });

        //当选择了主机后，给主机的结果值赋值
        $("#chartDatasourcehost").on("change", function (e) {
            if(e.val){
                kpiRelCIResult = [];
                for(var i = 0 ; i < e.val.length ; i++){
                    kpiRelCIResult.push(e.val[i]);
                }
            }
        });

        /**
         * 结束KPI及选择CI进行初始化
         */

        /**
         * 初始化图表按照实时刷新和历史查询那部分的DOM节点
         * @type {*|jQuery|HTMLElement}
         */
        var chartDatatypeOntime = $("#chartdatatype_ontime");
        var chartDatatypeHistory = $("#chartdatatype_history");
        var chartPreview = $("#chartpreview");

        //初始化实时和历史已经设置的显示
        if(chartDatatypeOntime.attr("checked")){
            $("#uchart_setting_attr_refresh").removeClass("uchart_setting_attr_hidden");
            $("#uchart_setting_attr_refresh").addClass("uchart_setting_attr_show");
        }
        if(chartDatatypeHistory.attr("checked")){
            $("#uchart_setting_attr_daterange").removeClass("uchart_setting_attr_hidden");
            $("#uchart_setting_attr_daterange").addClass("uchart_setting_attr_show");
        }

        //绑定预览事件
        chartPreview.on("click", function (e) {
            var checkrtn = preViewCheck();
            if(checkrtn){
                var cfg = {
                    "color":"white",
                    "bgColor":"gray",
                    "fontSize":"25px"
                };
                var chartOptions = eval("("+getResultOptions()+")");;
                var chartView = dashboard.getChartView();
                var html = chartView.getPreviewTemplate("chartTemplate_default","chart_previewcontanier",chartOptions.chartTitle);
                $(this).html(html);
                if(html && chartCate){
                    var chartDataModel = chartView.getPreviewDataModel({chartCate: chartCate});
                    if(chartDataModel.getData()){
                        var chartInstance = chartView.getPreviewChartInstance({chartCate: chartCate,chartRefreshInterval:chartOptions.chartRefreshInterval},chartDataModel);
                        chartInstance.bindData(chartDataModel.getData());
                        chartInstance.setSize(208,230);
                        chartInstance.createRender("id","chart_previewcontanier");
                        chartInstance.draw(cfg);
                        if($("#chartdatatype_ontime").attr("checked") && $("#chartrefresh").val() && parseInt($("#chartrefresh").val()) != 0){
                            chartInstance.updateInterval(chartInstance);
                        }

                    }

                }

            }else{
                alert("请选择KPI、选择CI、选择实时或历史并后再进行预览")
            }
        });


        //为实时kpi选择框绑定选中事件
        chartDatatypeOntime.on("click", function (e) {
            if($(this).attr("checked")){

                //清空和隐藏历史kpi参数
                $("#chartdatatype_history").removeAttr("checked");
                $("#uchart_setting_attr_daterange").removeClass("uchart_setting_attr_show");
                $("#uchart_setting_attr_daterange").addClass("uchart_setting_attr_hidden");
                $("#chartdatehour").val("");
                $("#chartdatemin").val("");

                //显示实时kpi参数
                $("#uchart_setting_attr_refresh").removeClass("uchart_setting_attr_hidden");
                $("#uchart_setting_attr_refresh").addClass("uchart_setting_attr_show");
            }else{
                //清空和隐藏实时kpi参数
                $("#uchart_setting_attr_refresh").removeClass("uchart_setting_attr_show");
                $("#uchart_setting_attr_refresh").addClass("uchart_setting_attr_hidden");
                $("#chartrefresh").val("");
            }
        });

        //为历史kpi配置绑定选中事件
        chartDatatypeHistory.on("click", function (e) {
            if($(this).attr("checked")){

                //清空和隐藏实时kpi参数
                $("#chartdatatype_ontime").removeAttr("checked");
                $("#uchart_setting_attr_refresh").removeClass("uchart_setting_attr_show");
                $("#uchart_setting_attr_refresh").addClass("uchart_setting_attr_hidden");
                $("#chartrefresh").val("");

                //显示历史kpi参数
                $("#uchart_setting_attr_daterange").removeClass("uchart_setting_attr_hidden");
                $("#uchart_setting_attr_daterange").addClass("uchart_setting_attr_show");
            }else{
                //清空和隐藏历史kpi参数
                $("#uchart_setting_attr_daterange").removeClass("uchart_setting_attr_show");
                $("#uchart_setting_attr_daterange").addClass("uchart_setting_attr_hidden");
                $("#chartdatehour").val("");
                $("#chartdatemin").val("");
            }
        });

        var getResultOptions = function () {
            var chartOptions = {};
            chartOptions.chartTitle = $("#chartTitle").val();
            chartOptions.chartOffset = parseInt($("#chartOffset").val());
            if(!$("#chartOffset").val()){
                chartOptions.chartOffset = 0;
            }
            chartOptions.chartDatasourcehost = kpiRelCIResult;

            chartOptions.chartRefreshInterval = parseInt($("#chartrefresh").val());
            if(!$("#chartrefresh").val()){
                chartOptions.chartRefreshInterval = 0;
            }
            chartOptions.chartDateHour = parseInt($("#chartdatehour").val());
            if(!$("#chartdatehour").val()){
                chartOptions.chartDateHour = 0;
            }
            chartOptions.chartDateMin = parseInt($("#chartdatemin").val());
            if(!$("#chartdatemin").val()){
                chartOptions.chartDateMin = 0;
            }

            chartOptions.chartDatasourceKPI = kpiResult;

            if($("#chartxaxis").attr("checked")){
                chartOptions.chartxAxisCheck = true;
            }else{
                chartOptions.chartxAxisCheck = false;
            }
            if($("#chartyaxis").attr("checked")){
                chartOptions.chartyAxisCheck = true;
            }else{
                chartOptions.chartyAxisCheck = false;
            }
            if($("#chartdatatype_ontime").attr("checked")){
                chartOptions.chartonTimeCheck = true;
            }else{
                chartOptions.chartonTimeCheck = false;
            }
            if($("#chartdatatype_history").attr("checked")){
                chartOptions.chartHistoryCheck = true;
            }else{
                chartOptions.chartHistoryCheck = false;
            }
            chartOptions.chartTemplate = "chartTemplate_default";

            chartOptions = JSON.stringify(chartOptions);
            return chartOptions;
        };

        var preViewCheck = function () {
            var rtn = true;

            //判断主机名是否为空
            if( !kpiRelCIResult ){
                rtn = false;
            }

            if( kpiRelCIResult && !(kpiRelCIResult.length > 0) ){
                rtn = false;
            }

            //判断是否选择了KPI
            if( !kpiResult ){
                rtn = false;
            }

            //判断选择了实时，或者历史
            if( !$("#chartdatatype_ontime").attr("checked") && !$("#chartdatatype_history").attr("checked") ){
                rtn = false;
            }

            //判断选择历史后是否填写了小时和分钟，如果都没有填写则不通过
            if($("#chartdatatype_history").attr("checked")){
                if((!$("#chartdatehour").val() && !$("#chartdatemin").val())){

                    rtn = false;
                }
                if($("#chartdatehour").val() && !/\d+/g.test($("#chartdatehour").val())){
                    rtn = false;
                }

                if($("#chartdatemin").val() && !/\d+/g.test($("#chartdatemin").val())){
                    rtn = false;
                }

                if((!$("#chartdatehour").val() || $("#chartdatehour").val() == 0) && $("#chartdatemin").val() <= 0){
                    rtn = false;
                }

                if((!$("#chartdatemin").val() || $("#chartdatemin").val() == 0) && $("#chartdatehour").val() <= 0){
                    rtn = false;
                }
            }

            return rtn;
        }


    };

    self.runSetting = runSetting;
})(nameSpace.reg("dashboard.chartsetting"));