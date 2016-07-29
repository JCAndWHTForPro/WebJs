/**
 * Created by Administrator on 2016/7/8.
 */
package("cm.common.util");

cm.common.util.WsfTool = {

	//打印信息
    print:function(msg){
        if(msg){
            console.log(msg);
        }else{
            console.log("print test.");
        }
    },
    //获取自身路径
    getSelfPath:function(jsFileName){
		var js=document.scripts;
		var jsPath;
		for(var i=js.length;i>0;i--){
			if(js[i-1].src.indexOf(jsFileName)>-1){
				jsPath=js[i-1].src.substring(0,js[i-1].src.lastIndexOf("/")+1);
			}
		}
		return jsPath;
    },

    componentidcache: {},

    generateId: function (componentName) {
        if (typeof(cm.common.util.WsfTool.componentidcache[componentName]) == 'undefined') {
            cm.common.util.WsfTool.componentidcache[componentName] = 0;
        }
        cm.common.util.WsfTool.componentidcache[componentName] = cm.common.util.WsfTool.componentidcache[componentName] + 1;
        return componentName + cm.common.util.WsfTool.componentidcache[componentName];
    }

}