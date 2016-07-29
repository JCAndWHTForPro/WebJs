$("head").append("<script src='./js/cm-i18n.js'></script>");
/**
 * 定义包的命名空间
 * @param module
 * @param funcExportDefine
 */
var package = function (namespace) {
    var arr = namespace.split(".");
    var ns = "";
    for (var i = 0; i < arr.length; i++) {
        if (i > 0) ns += ".";
        ns += arr[i];
        eval("if(typeof(" + ns + ") == 'undefined') { " + ns + " = {};}");
    }
}

/**
 * 导入JS类
 * @param libpath JS类路径
 */
var $import = function (libpath) {
    var isImported = function(){
        var arr = libpath.split(".");
        var ctx = window;
        var ns = "";
        for (var i = 0; i < arr.length; i++) {
            if (i > 0) ns += ".";
            if(typeof(ctx[arr[i]])=='undefined'){
                return false;
            }else{
                ctx = ctx[arr[i]];
            }
        }
        return true;
    }

    if (isImported()){
        return;
    }

    var subNames = libpath.split('.');
    var jsPath = "./js/";
    for (var i = 0; i < subNames.length; i++) {
        if (i == subNames.length - 1) {
            jsPath = jsPath + subNames[i] + ".js";
        } else {
            jsPath = jsPath + subNames[i] + "/";
        }
    }
    $("head").append("<script src='" + jsPath + "'></script>");
}
/**
 * 导入css
 * @param libpath css类路径
 */
var $importStyle = function(cssPath){
    var subNames = cssPath.split('.');
    var cssFileNamePre = subNames[subNames.length-1];
    var jsPath = "";
    for(var i=0;i<subNames.length;i++){
        if(i==subNames.length-1){
            jsPath = jsPath+subNames[i]+".js"
        }else{
            jsPath = jsPath+subNames[i]+'/';
        }
    }
    var js=document.scripts;
    var jsPath_;
    for(var i=js.length;i>0;i--){
        if(js[i-1].src.indexOf(jsPath)>-1){
            jsPath_=js[i-1].src.substring(0,js[i-1].src.lastIndexOf("/")+1);
            break;
        }
    }
    $("head").append('<link rel="stylesheet" type="text/css" href="'+jsPath_+cssFileNamePre+'.css">');
}

function getI18n(key){
    //TODO 获取中英文环境
    var env = "zh_CN";
    var value = i18n_data[env][key];
    if((typeof value) != "undefined"){
        return value;
    }else{
        return key;
    }
}

/**
 * 添加方法
 * 查找数组对象Index方法
 * @param val
 * @returns {number}
 */
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) return i;
    }
    return -1;
};

/**
 * 添加方法
 * 移除数组内指定对象
 * @param val
 */
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

