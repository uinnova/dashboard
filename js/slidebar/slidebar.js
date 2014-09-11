/**
 * Created by leiting on 14/9/11.
 * 定义左侧工具bar的对象
 */
define(["slidebardata","../utils/generateid"], function (slidebardata,generateid) {
    var d = slidebardata.getData();
    console.log(generateid.getguid(d[0].uchartcate));
    return d;
});