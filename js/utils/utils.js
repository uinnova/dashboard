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