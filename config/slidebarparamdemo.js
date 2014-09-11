/**
 * Created by leiting on 14/9/10.
 * 该文件以后需要删除,不需要发布
 */
    //仪表盘配置数据返回值data部分的业务数据示例,输出
var configdemo = [
    {
        "_id_":"xxx",
        "instanceid": "AREA_XXX-XXX-XXX",
        "bizobj": ["192.168.1.1","hostname"],
        "kpi": "kpiname",
        "options": "{...}"
    },
    {
        "_id_":"xxx",
        "instanceid": "PIE_XXX-XXX-XXX",
        "bizobj": ["192.168.1.1","hostname"],
        "kpi": "kpiname",
        "options": "{...}"
    }
];

//保存和修改接口输入参数示例
var confparam = {
    "biz": "save",
    "param": {
        "_id_":"xxx",
        "instanceid": "AREA_XXX-XXX-XXX",
        "bizobj": ["192.168.1.1","hostname"],
        "kpi": "kpiname",
        "options": "{...}"
    }
};

//获取仪表盘配置数据接口输入参数
var confgetparam = {
    "biz": "get",
    "param": {
        "instanceid": ["AREA_XXX-XXX-XXX","AREA_XXX-XXX-XXX..."]
    }
};

//后台标准的输出
var commonrtn = {
    data:{},
    message:"XXX",
    success:true
};