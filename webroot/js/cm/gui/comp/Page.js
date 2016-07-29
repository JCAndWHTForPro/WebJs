/**
 * Created by Administrator on 2016/7/14.
 */
package("cm.gui.comp");

$import("cm.common.util.WsfTool");

cm.gui.comp.Page = function(url){
    cm.gui.comp.Component.call(this);
    this.selfid = cm.common.util.WsfTool.generateId("Page-");
    this.html = "<div id='"+this.selfid+"' class='full'></div>";

    this.addLinkDOMListener(function($this){
        $this.setUrl(url);
    })

}
cm.gui.comp.Page.prototype = new cm.gui.comp.Component();

cm.gui.comp.Page.prototype.setUrl = function(url){
    this.getHtml().load(url);
}

