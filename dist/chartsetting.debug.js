/*!
 * dashboard - JS for Debug
 * @licence dashboard - v0.1.0 (2014-09-17)
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
        //获取cell原有设置的值
        var chartOptions = cell.getAttribute("chartOptions",null);
        var chartOptionsobj = {};
        if(chartOptions){
            chartOptionsobj = eval("("+chartOptions+")");
        }
        var chartCate = cell.getAttribute("chartcate",null);
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

            if(error.length === 0){
                cell.setAttribute("chartOptions",getResultOptions());
                editorobj.graph.refresh(cell);
                graphobj.utils.alert("配置已更新");
                dialog.hide();
            }else{
                graphobj.utils.alert(error.join("\r\n"));
            }
        });


        var chartDatatypeOntime = $("#chartdatatype_ontime");
        var chartDatatypeHistory = $("#chartdatatype_history");
        var chartDatasourceKPI = $("#chartDatasourceKPI");
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
                var chartOptions = eval("("+getResultOptions()+")");;
                var chartView = dashboard.getChartView();
                var html = chartView.getPreviewTemplate("chartTemplate_default","chart_previewcontanier",chartOptions.chartTitle);
                $(this).html(html);
                if(html && chartCate){
                    var chartDataModel = chartView.getPreviewDataModel({chartCate: chartCate});
                    if(chartDataModel.getData()){
                        var chartInstance = chartView.getPreviewChartInstance({chartCate: chartCate,chartRefreshInterval:chartOptions.chartRefreshInterval},chartDataModel);
                        chartInstance.bindData(chartDataModel.getData());
                        chartInstance.setSize(258,230);
                        chartInstance.createRender("id","chart_previewcontanier");
                        chartInstance.draw();
                        if($("#chartdatatype_ontime").attr("checked") && $("#chartrefresh").val() && parseInt($("#chartrefresh").val()) != 0){
                            chartInstance.updateInterval(chartInstance);
                        }

                    }

                }

            }else{
                alert("请填写CI关键字、KPI字段、选择实时或历史并后再进行预览")
            }
        });

        //初始化KPI的选中项
        chartDatasourceKPI.val(chartOptionsobj.chartDatasourceKPI);
        //为实时kpi选择框绑定选中事件
        chartDatatypeOntime.on("click", function (e) {
            if($(this).attr("checked")){

                //清空和隐藏历史kpi参数
                $("#chartdatatype_history").removeAttr("checked");
                $("#uchart_setting_attr_daterange").removeClass("uchart_setting_attr_show");
                $("#uchart_setting_attr_daterange").addClass("uchart_setting_attr_hidden");
                $("#chartdaterange").val("");
                $("#chartstarttime").val("");
                $("#chartendtime").val("");

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
                $("#chartdaterange").val("");
                $("#chartstarttime").val("");
                $("#chartendtime").val("");
            }
        });
        //设置开始和结束时间字段
        $("#chartdaterange").daterangepicker({
            format: 'YYYY-MM-DD hh:mm:ss',
            timePicker: true
        }, function (start, end) {
            $("#chartstarttime").val(start.format('YYYY-MM-DD hh:mm:ss'));
            $("#chartendtime").val(end.format('YYYY-MM-DD hh:mm:ss'));
        });

        var getResultOptions = function () {
            var chartOptions = {};
            chartOptions.chartTitle = $("#chartTitle").val();
            chartOptions.chartOffset = parseInt($("#chartOffset").val());
            if(!$("#chartOffset").val()){
                chartOptions.chartOffset = 0;
            }
            chartOptions.chartDatasourcehost = $("#chartDatasourcehost").val();
            chartOptions.chartRefreshInterval = parseInt($("#chartrefresh").val());
            if(!$("#chartrefresh").val()){
                chartOptions.chartRefreshInterval = 0;
            }
            chartOptions.chartStarttime = $("#chartstarttime").val();
            chartOptions.chartEndtime = $("#chartendtime").val();
            chartOptions.chartDatasourceKPI = $("#chartDatasourceKPI").val();
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
            if( !$("#chartDatasourcehost").val() ){
                rtn = false;
            }

            //判断是否选择了KPI
            if( !$("#chartDatasourceKPI").val() ){
                rtn = false;
            }

            //判断选择了实时，
            if( !$("#chartdatatype_ontime").attr("checked") && !$("#chartdatatype_history").attr("checked") ){
                rtn = false;
            }

            return rtn;
        }


    };

    self.runSetting = runSetting;
})(nameSpace.reg("dashboard.chartsetting"));