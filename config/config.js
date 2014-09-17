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