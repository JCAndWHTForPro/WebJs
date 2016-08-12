package("cm.gui.comp.tab");

$import("cm.common.util.WsfTool");
$import("cm.gui.comp.Component");

$importStyle("cm.gui.comp.tab.TabPanel");

cm.gui.comp.tab.TabPanel = function () {

    //继承父类属性cm.gui.comp.Component
    cm.gui.comp.Component.call(this);

    this.selfid = cm.common.util.WsfTool.generateId("TabPanel-");

    this.panelContainerID = cm.common.util.WsfTool.generateId(this.selfid+"-container-");

    var vmID = cm.common.util.WsfTool.generateId(this.selfid+"-avalon-vm-");


    this.html = "<div ms-controller='"+vmID+"' id='"+this.selfid+"' class='full'>" +
        "<div>" +
        "<ul class='nav nav-tabs'>" +
        "<li role='presentation' ms-repeat='tabpanels' class='handmouse' ms-class='active: currentIndex === $index\'>" +
        "<a ms-click='changeIndex($index)' >{{el.title}}" +
        "<span ms-if='el.closeable==true' class=\"glyphicon glyphicon-remove close-span\" aria-hidden=\"true\" ms-click='closeTab($index)'></span>" +
        "</a>" +
        "</li></ul>" +
        "</div>" +
        "<div id='"+this.panelContainerID+"'></div>" +
        "</div>";

    var $this = this;

    var tabvm ={
        $id: vmID,
        text: "hello",
        currentIndex: 0,
        tabpanels: [],
        changeIndex: function (tabindex) {
            if(tabindex>=tabvm.tabpanels.length){
                return;
            }
            tabvm.currentIndex = tabindex;
            var panelid = tabvm.tabpanels[tabvm.currentIndex].panelid;
            for (var i =0;i <$this.innerCompnents.length;i++){
                if ($this.innerCompnents[i].getID() == panelid){
                    $this.innerCompnents[i].show();
                }else{
                    $this.innerCompnents[i].hide();
                }
            }
            var currentPanel = tabvm.tabpanels[tabvm.currentIndex];
            if(typeof(currentPanel.changeCallBack)=="function"){
                currentPanel.changeCallBack($this.getCurrentPanel());
            }
        },
        closeTab: function(tabindex){
            var panelInfo = tabvm.tabpanels[tabindex];
            var panelid = panelInfo.panelid;
            tabvm.tabpanels.removeAt(tabindex);
            var selectIndex = tabvm.tabpanels.length - 1;
            if (selectIndex>=0) {
                tabvm.changeIndex(selectIndex);
            }
            for (var i = 0;i<$this.innerCompnents.length;i++){
                if ($this.innerCompnents[i].getID() == panelid){
                    var callback = panelInfo.closecallback;
                    if (typeof(callback)=='function'){
                        callback($this.innerCompnents[i]);
                    }
                    $this.removeComponent($this.innerCompnents[i])
                    break;
                }
            }

        }

    };

    this.addLinkDOMListener(function($this){
        $this.resize(true);
        tabvm = tabvm = avalon.define(tabvm);
        avalon.scan();
    });

    this.canActivateTab = function(id){
        for(var i = 0 ;i < tabvm.tabpanels.length;i++){
            if(tabvm.tabpanels[i].id==id){
                this.activate(id);
                return true;
            }
        }
        return false;
    }

    this.addPanel = function (id, title, panel,closeable,closecallback,changeCallBack) {
        for (var i = 0; i < this.innerCompnents.length; i++) {
            if (this.innerCompnents[i] === panel) {
                return;
            }
        }

        for(var i = 0 ;i < tabvm.tabpanels.length;i++){
            if(tabvm.tabpanels[i].id==id){
                this.activate(id);
                return;
            }
        }

        this.innerCompnents.push(panel);

        if (this.isLinkedDOM()) {
            panel.linkDOM(this.panelContainerID);
        }

        tabvm.tabpanels.push({
            id: id,
            title: title,
            panelid: panel.getID(),
            closeable:closeable,
            closecallback:closecallback,
            changeCallBack:changeCallBack
        });
        this.activate(id);
    }

    this.activate = function (id) {
        for (var index = 0; index < tabvm.tabpanels.length; index++) {
            if (tabvm.tabpanels[index].id === id) {
                tabvm.currentIndex = index;
                $this.innerCompnents[index].show();
            }else{
                $this.innerCompnents[index].hide();
            }
        }

    }

    this.getCurrentPanel = function(){
        if(tabvm.currentIndex!=undefined){
            var panelId = tabvm.tabpanels[tabvm.currentIndex].panelid;
            for(var i=0;i<this.innerCompnents.length;i++){
                if(this.innerCompnents[i].getID()==panelId){
                    return this.innerCompnents[i];
                }
            }
        }
        return null;
    }

}



//继承父类原型链方法
cm.gui.comp.tab.TabPanel.prototype = new cm.gui.comp.Component();

//覆盖父类方法，使父类方法失效
cm.gui.comp.tab.TabPanel.prototype.addComponent = function (componet) {

}



cm.gui.comp.tab.TabPanel.prototype.linkInnerComponentsToDOM = function () {
    for(var i = 0 ;i<this.innerCompnents.length;i++){
        this.innerCompnents[i].linkDOM(this.panelContainerID);
    }
}

cm.gui.comp.tab.TabPanel.prototype.resize = function(init){
    var tabbar = this.getHtml().find("div").eq(0);
    var container = this.getHtml().find("div").eq(1);
    container.height(this.getHtml().height() - tabbar.height());
    container.width(this.getHtml().width());
    if(!init) {
        for (var i = 0; i < this.innerCompnents.length; i++) {
            this.innerCompnents[i].resize();
        }
    }
}

