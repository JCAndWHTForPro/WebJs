/**
 * Created by Administrator on 2016/7/14.
 */
package("cm.wsf.topo");

$import("cm.gui.comp.Tree");

cm.wsf.topo.MocTree = function(neNodeData){
    cm.gui.comp.Tree.call(this);
    this.neNodeData = neNodeData;
}

cm.wsf.topo.MocTree.prototype = new cm.gui.comp.Tree();

cm.wsf.topo.MocTree.prototype.getNeData = function(){
    return this.neNodeData;
}

cm.wsf.topo.MocTree.prototype.setNeData = function(neNodeData){
    this.neNodeData = neNodeData;
}
