/**
 * Created by Administrator on 2016/7/10.
 */
package("cm.gui.comp");

$import("cm.gui.comp.Component");
$import("cm.common.util.WsfTool");

$importStyle("cm.gui.comp.YSeperatorPanel");
/**
 * para{
 *    dragable:true,// 中间的分割条是否可以拖动
 *    splitWidth:3,//单位是PX，分割条的宽度如果是0则不显示
 *    splitUnit:"%",//"%"百分比，"px"像素
 *    splitValue:50,//已leftcomponent为基准，如果是百分比 取值范围(0,100), 如果是绝对像素则直接取值[0-)
 *    staticTop:40,//顶部固定高度，如果是静态的高度，则不能拖
 *    staticBottom:40,//底部固定高度
 * }
 * @param para
 * @constructor
 */
cm.gui.comp.YSeperatorPanel = function(para){

    this.para={
        dragable:false,// 中间的分割条是否可以拖动
        splitWidth:3,//单位是PX，分割条的宽度如果是0则不显示
        splitUnit:"%",//"%"百分比，"px"像素
        splitValue:50,//已leftcomponent为基准，如果是百分比 取值范围(0,100), 如果是绝对像素则直接取值[0-)

    }
    if (para){
        this.para = para;
    }

    cm.gui.comp.Component.call(this);

    this.selfid = cm.common.util.WsfTool.generateId("YSeperatorPanel-");

    this.leftComponent = null;

    this.rightComponent = null;

    this.leftid = this.selfid+"-left";

    this.rightid = this.selfid+"-right";

    var splitWidth,splitUnit,splitValue,dragable;
    if(this.para.splitWidth ===0){
        splitWidth = 0;
    }else if(this.para.splitWidth){
        splitWidth = this.para.splitWidth;
    }else{
        splitWidth = 3;
    }

    if(this.para.splitUnit){
        splitUnit = this.para.splitUnit;
    }else{
        splitUnit = '%';
    }

    if(this.para.splitValue){
        splitValue = this.para.splitValue;
    }else{
        splitValue = 50;
    }

    if(this.para.dragable){
        dragable = this.para.dragable;
    }else{
        dragable = false;
    }

    this.html = "<div id='"+this.selfid+"' class='y-seperator'><ul class='y-seperator-ul'>" +
        "<li class='y-seperator-li'><div class='full' id='"+this.leftid+"'></div></li>" +
        "<label class='y-seperator-label' style='height: "+splitWidth+"px;'></label>" +
        "<li class='y-seperator-li'><div class='full' id='"+this.rightid+"'></div></li>" +
        "</ul></div>";

    var clickY, leftOffset,  nextW2,wrapHeight,wrap,labBtn,topHeight;
    var dragging  = false;


    this.init = function(){
        wrapHeight = wrap.height();
        if (this.para.staticTop){
            topHeight = this.para.staticTop;
            labBtn.css('top', topHeight + 'px');
            labBtn.prev().height(topHeight + 'px');
            labBtn.next().height(wrapHeight - topHeight - splitWidth + 'px');
            dragable = false;
        }else if(this.para.staticBottom){
            var bottomHeight = this.para.staticBottom;
            labBtn.css('top', wrapHeight - bottomHeight + 'px');
            labBtn.prev().height(wrapHeight - bottomHeight - splitWidth + 'px');
            labBtn.next().height(bottomHeight + 'px');
            dragable = false;
        }else if (splitUnit =='%') {
            var pecent = splitValue/100;
            topHeight = pecent * (wrapHeight - splitWidth);
            labBtn.css('top', topHeight + 'px');
            labBtn.prev().height(topHeight + 'px');
            labBtn.next().height(wrapHeight - topHeight - splitWidth + 'px');
        }else{
            topHeight = splitValue;
            if (topHeight>(wrapHeight-splitWidth)){
                labBtn.css('top', (wrapHeight-splitWidth) + 'px');
                labBtn.prev().height((wrapHeight-splitWidth) + 'px');
                labBtn.next().height('0px');
            }else{
                labBtn.css('top', topHeight + 'px');
                labBtn.prev().height(topHeight + 'px');
                labBtn.next().height(wrapHeight - topHeight - splitWidth + 'px');
            }
        }

    }

    this.addLinkDOMListener(function($this){
        wrap = $this.getHtml();
        labBtn  = wrap.find('label');
        $this.init();

        $(window).resize(function(){
            $this.resize();
        });

        if(dragable) {
            labBtn.bind('mousedown', function () {
                    dragging = true;
                    leftOffset = $("#" + $this.getID()).offset().top;
                }
            );

            wrap.bind('mousemove', function (e) {
                if (dragging) {
                    clickY = e.pageY;
                    if (clickY > leftOffset && clickY < (leftOffset + wrapHeight - splitWidth)) {
                        labBtn.css('top', clickY - splitWidth - leftOffset + 'px');//按钮移动
                        labBtn.prev().height(clickY - leftOffset + 'px');
                        nextW2 = clickY - leftOffset;
                        labBtn.next().height(wrapHeight - nextW2 - splitWidth + 'px');
                    } else if (clickY <= leftOffset) {
                        labBtn.css('top', '0px');
                        labBtn.prev().height('0px');
                        labBtn.next().height(wrapHeight - splitWidth + 'px');
                    } else {
                        labBtn.css('top', (wrapHeight - splitWidth) + 'px');
                        labBtn.prev().height((wrapHeight - splitWidth) + 'px');
                        labBtn.next().height('0px');
                    }
                    if (splitUnit =='%') {
                        splitValue = 100 * (clickY - leftOffset) / wrapHeight;
                    }else{
                        splitValue = clickY - leftOffset;
                    }
                    $this.resize(true);
                }
            });

            wrap.mouseup(function (e) {
                dragging = false;
                e.cancelBubble = true;
            })
        }else{
            labBtn.css("cursor","default");
        }
    });



}

cm.gui.comp.YSeperatorPanel.prototype = new cm.gui.comp.Component();

//使父类的addComponent方法失效
cm.gui.comp.YSeperatorPanel.prototype.addComponent = function(){

}

cm.gui.comp.YSeperatorPanel.prototype.linkInnerComponentsToDOM = function () {
    if(this.leftComponent){
        this.leftComponent.linkDOM(this.leftid);
    }
    if(this.rightComponent){
        this.rightComponent.linkDOM(this.rightid);
    }
}

cm.gui.comp.YSeperatorPanel.prototype.resize = function(privateCall) {
    if (!privateCall){
        this.init();
    }
    if (this.leftComponent) {
        this.leftComponent.resize();
    }

    if (this.rightComponent) {
        this.rightComponent.resize();
    }
}

cm.gui.comp.YSeperatorPanel.prototype.setTopComponent = function(component){
    if (component){
        if(this.leftComponent== null){
            this.leftComponent = component;
            if (this.isLinkedDOM()) {
                component.linkDOM(this.leftid);
            }
        }else{
            this.leftComponent.dispose();
            this.leftComponent = component;
            if (this.isLinkedDOM()) {
                component.linkDOM(this.leftid);
            }
        }
    }
}

cm.gui.comp.YSeperatorPanel.prototype.setBottomComponent = function(component){
    if (component){
        if (this.rightComponent == component){
            return;
        }
        if(this.rightComponent== null){
            this.rightComponent = component;
            if (this.isLinkedDOM()) {
                component.linkDOM(this.rightid);
            }
        }else{
            this.rightComponent.dispose();
            this.rightComponent = component;
            if (this.isLinkedDOM()) {
                component.linkDOM(this.rightid);
            }
        }
    }
}