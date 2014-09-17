/**
 * Created by leiting on 14/7/31.
 */
/***
 * 注册全局变量的对象，其中有3个方法。
 * reg：注册全局变量，建议全局变量都注册在UPORTAL这个大的对象下面。
 * del：删除某个对象
 * isDefined：是否已经定义过该对象，返回true|false
 */
(function(self) {
    self.nameSpace = {

        reg: function(s){
            var arr = s.split('.');
            var namespace = self;

            for (var i = 0, k = arr.length; i < k; i++) {
                if (typeof namespace[arr[i]] == 'undefined') {
                    namespace[arr[i]] = {};
                }

                namespace = namespace[arr[i]];
            }

            return namespace;
        },

        del: function(s){
            var arr = s.split('.');
            var namespace = self;

            for (var i = 0, k = arr.length; i < k; i++) {
                if (typeof namespace[arr[i]] == 'undefined') {
                    return;
                }else if (k == i + 1) {
                    delete namespace[arr[i]];
                    return;
                }else{
                    namespace = namespace[arr[i]];
                }
            }
        },

        isDefined: function(s){
            var arr = s.split('.');
            var namespace = self;

            for (var i = 0, k = arr.length; i < k; i++) {
                if (typeof namespace[arr[i]] == 'undefined') {
                    return false;
                }

                namespace = namespace[arr[i]];
            }

            return true;
        }
    }

})(this);