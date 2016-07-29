package("cm.gui.comp");

$import("cm.common.util.WsfTool");

/**
 * 视图基类
 * @constructor
 */
cm.gui.comp.Component = function () {

    this.selfid = cm.common.util.WsfTool.generateId("Component-");

    this.html = "<div id='"+this.selfid+"' class='full'></div>";

    this.linkedDOM = false;

    this.innerCompnents = [];

    this.linkDOMListeners= [];

    this.jQueryNode = null;

}

cm.gui.comp.Component.prototype.getInnerCompnents = function(){
    return this.innerCompnents;
}

cm.gui.comp.Component.prototype.getID = function () {
    return this.selfid;
}

cm.gui.comp.Component.prototype.isLinkedDOM = function(){
    return this.linkedDOM;
}

cm.gui.comp.Component.prototype.getHtml = function () {
    if(this.jQueryNode == null){
        this.jQueryNode = $(this.html);
    }
    return this.jQueryNode;
}

cm.gui.comp.Component.prototype.addComponent = function (component) {
    for (var i = 0; i < this.innerCompnents.length; i++) {
        if (this.innerCompnents[i] === component) {
            return;
        }
    }
    this.innerCompnents.push(component);
    if (this.isLinkedDOM()) {
        component.linkDOM(this.getID());
    }
}

cm.gui.comp.Component.prototype.linkDOM = function(pid){
    if(!this.isLinkedDOM()){
        $("#" + pid).append(this.getHtml());
        this.linkedDOM = true;
        for (var i =0 ;i <this.linkDOMListeners.length;i++){
            if (typeof(this.linkDOMListeners[i])=='function'){
                var listener = this.linkDOMListeners[i];
                listener(this);
            }
        }
        this.linkInnerComponentsToDOM();
    }
}

cm.gui.comp.Component.prototype.linkInnerComponentsToDOM = function () {
    for(var i = 0 ;i<this.innerCompnents.length;i++){
        this.innerCompnents[i].linkDOM(this.getID());
    }
}

cm.gui.comp.Component.prototype.addLinkDOMListener = function(listener){
    if (typeof(listener) == 'function'){
        this.linkDOMListeners.push(listener);
    }
}

cm.gui.comp.Component.prototype.removeComponent = function (component) {
    if (this.innerCompnents.indexOf(component)!=-1){
        this.innerCompnents.remove(component);
        component.getHtml().remove();
        delete component;
    }
}

cm.gui.comp.Component.prototype.dispose = function () {
    this.getHtml().remove();
    delete this;
}

cm.gui.comp.Component.prototype.setBackgroundColor = function(color){
    this.getHtml().css("background-color",color);
}

cm.gui.comp.Component.prototype.show = function () {
    this.getHtml().show();
}

cm.gui.comp.Component.prototype.hide = function () {
    this.getHtml().hide();
}

cm.gui.comp.Component.prototype.resize = function() {
    for(var i=0 ;i<this.innerCompnents.length;i++){
        this.innerCompnents[i].resize();
    }
}
