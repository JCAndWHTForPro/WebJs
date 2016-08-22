/**
 * Created by Administrator on 2016/7/10.
 */
package("cm.gui.comp");

$import("cm.gui.comp.Component");
$import("cm.common.util.WsfTool");

$importStyle("cm.gui.comp.XSeperatorPanel");
/**
 * param{
 *    dragable:true,// 中间的分割条是否可以拖动
 *    splitWidth:3,//单位是PX，分割条的宽度如果是0则不显示
 *    splitUnit:"%",//"%"百分比，"px"像素
 *    splitValue:50,//已leftcomponent为基准，如果是百分比 取值范围(0,100), 如果是绝对像素则直接取值[0-)
 *    staticLeft:40,//左边固定宽度，如果是静态的宽度，则不能拖
 *    staticRight:40,//右边固定宽度
 * }
 * @param para
 * @constructor
 */
cm.gui.comp.XSeperatorPanel = function(para){

    cm.gui.comp.Component.call(this);

    this.para={
        dragable:false,// 中间的分割条是否可以拖动
        splitWidth:3,//单位是PX，分割条的宽度如果是0则不显示
        splitUnit:"%",//"%"百分比，"px"像素
        splitValue:50,//已leftcomponent为基准，如果是百分比 取值范围(0,100), 如果是绝对像素则直接取值[0-)

    }
    if (para){
        this.para = para;
    }

    var splitWidth,splitUnit,splitValue,dragable;
    this.setLocalParam = function(){
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
        
    }
    this.setLocalParam();

    this.selfid = cm.common.util.WsfTool.generateId("XeperatorPanel-");

    this.leftComponent = null;

    this.rightComponent = null;

    this.leftid = this.selfid+"-left";

    this.rightid = this.selfid+"-right";

    this.html = "<div id='"+this.selfid+"' class='x-seperator'><ul class='x-seperator-ul'>" +
        "<li class='x-seperator-li'><div class='full' id='"+this.leftid+"'></div></li>" +
        "<label class='x-seperator-label' style='width: "+splitWidth+"px;'></label>" +
        "<li class='x-seperator-li'><div class='full' id='"+this.rightid+"'></div></li>" +
        "</ul></div>";





    var clickX, leftOffset,  nextW2,wrapWidth,wrap,labBtn,leftWidth;
    var dragging  = false;

    this.init = function(){
        wrapWidth = wrap.width();
        if (this.para.staticLeft){
            leftWidth = this.para.staticLeft;
            labBtn.css('left', leftWidth + 'px');
            labBtn.prev().width(leftWidth + 'px');
            labBtn.next().width(wrapWidth - leftWidth - splitWidth + 'px');
            dragable = false;
        }else if(this.para.staticRight){
            var rightWidth = this.para.staticRight;
            labBtn.css('left', wrapWidth - rightWidth + 'px');
            labBtn.prev().width(wrapWidth - rightWidth - splitWidth + 'px');
            labBtn.next().width(rightWidth + 'px');
            dragable = false;
        }else if (splitUnit =='%') {
            var pecent = splitValue/100;
            leftWidth = pecent * (wrapWidth - splitWidth);
            labBtn.css('left', leftWidth + 'px');
            labBtn.prev().width(leftWidth + 'px');
            labBtn.next().width(wrapWidth - leftWidth - splitWidth + 'px');
        }else{
            leftWidth = splitValue;
            if (leftWidth>(wrapWidth-splitWidth)){
                labBtn.css('left', (wrapWidth-splitWidth) + 'px');
                labBtn.prev().width((wrapWidth-splitWidth) + 'px');
                labBtn.next().width('0px');
            }else{
                labBtn.css('left', leftWidth + 'px');
                labBtn.prev().width(leftWidth + 'px');
                labBtn.next().width(wrapWidth - leftWidth - splitWidth + 'px');
            }
        }
    }

    this.resetXSeperator = function(param){
        for(var o in param){
            this.para[o] = param[o];
        }
        this.setLocalParam();
        dragableWidthReset(this);
    }

    var dragableWidthReset = function($this){
        wrap = $("#"+$this.selfid);
        labBtn = wrap.find('label').eq(0);
        $this.init();
        $(window).resize(function(){
            $this.resize();
        });
        if (dragable) {
            bindDragableEvent($this,wrap,labBtn);
            labBtn.css("cursor","e-resize");
        }else{
            labBtn.css("cursor","default");
        }
        
    }
    var bindDragableEvent = function($this,wrap,labBtn){
        labBtn.bind('mousedown', function () {
            dragging = true;
            leftOffset = wrap.offset().left;
        });

        wrap.bind('mousemove', function (e) {
            if (dragging) {
                clickX = e.pageX;
                if (clickX > leftOffset && clickX < (leftOffset + wrapWidth - splitWidth)) {
                    labBtn.css('left', clickX - splitWidth - leftOffset + 'px');//按钮移动

                    labBtn.prev().width(clickX - leftOffset + 'px');
                    nextW2 = clickX - leftOffset;
                    labBtn.next().width(wrapWidth - nextW2 - splitWidth + 'px');
                } else if (clickX <= leftOffset) {
                    labBtn.css('left', '0px');
                    labBtn.prev().width('0px');
                    labBtn.next().width(wrapWidth - splitWidth + 'px');
                } else {
                    labBtn.css('left', (wrapWidth - splitWidth) + 'px');
                    labBtn.prev().width((wrapWidth - splitWidth) + 'px');
                    labBtn.next().width('0px');
                }

                if (splitUnit == '%') {
                    splitValue = 100 * (clickX - leftOffset) / wrapWidth;
                } else {
                    splitValue = clickX - leftOffset;
                }

                $this.resize(true);
            }
        });

        wrap.mouseup(function (e) {
            dragging = false;
            e.cancelBubble = true;
        });
    }

    this.addLinkDOMListener(function($this){
        dragableWidthReset($this);
    });
}

cm.gui.comp.XSeperatorPanel.prototype = new cm.gui.comp.Component();

//使父类的addComponent方法失效
cm.gui.comp.XSeperatorPanel.prototype.addComponent = function(){

}

cm.gui.comp.XSeperatorPanel.prototype.resize = function(privateCall) {
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


//设置左视图
cm.gui.comp.XSeperatorPanel.prototype.setLeftComponent = function(component){
    if (component){
        if(this.leftComponent== null){
            this.leftComponent = component;
            if (this.isLinkedDOM()) {
                component.linkDOM(this.leftid);
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

//设置左视图
cm.gui.comp.XSeperatorPanel.prototype.setRightComponent = function(component){
    if (component){
        if(this.rightComponent== null){
            this.rightComponent = component;
            if (this.isLinkedDOM()) {
                component.linkDOM(this.rightid);
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

cm.gui.comp.XSeperatorPanel.prototype.linkInnerComponentsToDOM = function () {
    if(this.leftComponent){
        this.leftComponent.linkDOM(this.leftid);
    }
    if(this.rightComponent){
        this.rightComponent.linkDOM(this.rightid);
    }
}