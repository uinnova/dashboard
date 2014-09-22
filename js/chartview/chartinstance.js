/**
 * Created by leiting on 14/9/16.
 */
(function (arg) {

    var self = arg;

    var instanceCategory = {};

    instanceCategory.AREA = function () {

    };
    instanceCategory.BAR = function () {

        var bar = new ubarb();
        bar.setType(0);

        return bar;
    };
    instanceCategory.HBAR = function () {

        var hbar = new ubb();
        hbar.setType(0);

        return hbar;
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

        var line = new uline();
        line.setType(0);
        line.setLinecategory("basis");

        return line;
    };
    instanceCategory.PIE = function () {

        var pie = new upieb();
        pie.setCircle(false);//是否生成圆环
        pie.setType(0);
        pie.setIcon(true);

        return pie;
    };
    instanceCategory.RADAR = function () {

        var radar = new uradarb();
        radar.setType(0);

        return radar;
    };
    instanceCategory.SCATTER = function () {

    };
    instanceCategory.NUMBER = function () {

        var number = new unumb();

        return number;
    };

    var getInstance = function (option) {
        return instanceCategory[option.chartCate](option);
    };

    self.getChartInstance = getInstance;

})(nameSpace.reg("dashboard"));