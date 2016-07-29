package("cm.gui.comp");

$import("cm.gui.comp.Component");
$import("cm.common.util.WsfTool");

/**
 * 最大扩张视图
 * @param parentid
 * @constructor
 */
cm.gui.comp.Frame = function (url) {

    //继承cm.gui.comp.Component父类
    cm.gui.comp.Component.call(this);

    //Component
    this.selfid = cm.common.util.WsfTool.generateId("Frame-");
    this.framename = this.selfid + "-iframe";
    this.frameid = this.framename + "-id";
    var generateUrl = function(){
        if (url){
            return "src='"+url+"'";
        }else{
            return "";
        }
    }

    //this.html = "<div id='" + this.getID() + "' class='full'></div>";
    //this.html = "<div id='" + this.getID() + "' class='full'><iframe "+generateUrl()+" id='" + this.frameid + "' name='" + this.framename + "' frameborder='0' class='full'></iframe></div>";

    this.html ="<div id='" + this.getID() + "' class='full'>" +
        "<div style='background:rgba(0,0,0,0);position:absolute;z-index:2;'></div>" +
        "<div style='position:absolute;z-index:1;'>" +
        "<iframe "+generateUrl()+" id='"+this.frameid+"' name='" + this.framename + "'  frameborder='0' style='margin: 0;padding: 0;'  class='full' ></iframe>" +
        "</div>" +
        "</div>";

    this.onloadListener = [];
    this.addLinkDOMListener(function ($this) {
        var iframe = document.getElementById($this.frameid);
        if (iframe.attachEvent) {
            iframe.attachEvent("onload", function () {
                for (var i = 0; i < $this.onloadListener.length; i++) {
                    var listener = $this.onloadListener[i];
                    listener();
                }
            });
        } else {
            iframe.onload = function () {
                for (var i = 0; i < $this.onloadListener.length; i++) {
                    var listener = $this.onloadListener[i];
                    listener();
                }
            };
        }
        $this.resize();

    });
}

//链接父类方法
cm.gui.comp.Frame.prototype = new cm.gui.comp.Component();

cm.gui.comp.Frame.prototype.setUrl = function (url) {
    this.getHtml().find("iframe").eq(0).attr("src", url);
}

cm.gui.comp.Frame.prototype.getSubWindow = function () {
    return window.frames[this.framename].window;
}

cm.gui.comp.Frame.prototype.addOnloadListener = function (listener) {
    if (typeof(listener) == 'function') {
        this.onloadListener.push(listener);
    }
}

cm.gui.comp.Frame.prototype.addComponent = function(){

}

cm.gui.comp.Frame.prototype.resize = function(){
    var firstDiv = this.getHtml().find("div").eq(0);
    firstDiv.width(this.getHtml().width());
    firstDiv.height(this.getHtml().height());

    var secondDiv = this.getHtml().find("div").eq(1);
    secondDiv.width(this.getHtml().width());
    secondDiv.height(this.getHtml().height());
}





