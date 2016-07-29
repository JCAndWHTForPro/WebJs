/**
 * Created by Administrator on 2016/7/19.
 */
package("cm.wsf.topo");

$import("cm.gui.comp.YSeperatorPanel");
$import("cm.gui.comp.XSeperatorPanel");

cm.wsf.topo.MainPanel = function (containerid) {

    var mainPanel = new cm.gui.comp.YSeperatorPanel({
        dragable: true,
        splitWidth: 1,
        splitUnit: "px",
        staticBottom: 40
    });
    mainPanel.linkDOM(containerid);

    var topMainPanel = new cm.gui.comp.YSeperatorPanel({
        splitWidth: 1,
        staticTop: 48
    });
    mainPanel.setTopComponent(topMainPanel);

    var footerPanel = new cm.gui.comp.XSeperatorPanel({
        dragable: false,
        splitWidth: 0,
        splitUnit: "px",
        splitValue: 0
    });
    footerPanel.html = "<div style='width:100%;height:40px;line-height:40px;text-align:center;background:#afafaf;font-size:12px'>© 2016-2065 中兴通讯股份有限公司 版权所有</div>";
    mainPanel.setBottomComponent(footerPanel);


    var topTitlePanel = new cm.gui.comp.XSeperatorPanel({
        dragable: false,
        splitWidth: 0,
        splitUnit: "px",
        staticLeft: 170
    });
    topMainPanel.setTopComponent(topTitlePanel);

    $("#" + topTitlePanel.selfid).css("background-color", "#008ed3");

    var topTitleLeftPanel = new cm.gui.comp.Component();
    topTitleLeftPanel.html = '<div style="font-size: 20px;color: #ffffff;height: 48px;line-height: 48px;padding-left: 10px;">NetNumen v0.1</div>'
    topTitlePanel.setLeftComponent(topTitleLeftPanel);

    this.centerPanel = new cm.gui.comp.XSeperatorPanel({
        dragable:true,
        splitWidth:2,
        splitUnit:"px",
        splitValue:265
    });
    topMainPanel.setBottomComponent(this.centerPanel);

    this.leftTreePanel = new cm.gui.comp.YSeperatorPanel({
        dragable:true,
        splitWidth:2,
        splitUnit:"%",
        splitValue:50
    });
    this.centerPanel.setLeftComponent(this.leftTreePanel);

}

cm.wsf.topo.MainPanel.prototype.getLeftTreePanel = function (){
    return this.leftTreePanel;
}

cm.wsf.topo.MainPanel.prototype.getCenterPanel = function (){
    return this.centerPanel;
}
