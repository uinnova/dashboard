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