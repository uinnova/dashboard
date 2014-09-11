/**
 * Created by leiting on 14/9/11.
 */
define(function () {

    var generateid = {};
    /***
     * 返回guid
     * @param s
     * @returns {string}
     */
    generateid.getguid = function (s) {
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        if(s){
            guid = s + "_" + guid;
        }

        return guid;
    };

    return generateid;

});