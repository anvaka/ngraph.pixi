const NODE_WIDTH = 10;

module.exports = function (animatedNode, ctx) {

  animatedNode.on('hover', function(mouseData, animatedNode, ctx){
    var x = animatedNode.pos.x - NODE_WIDTH/2,
        y = animatedNode.pos.y - NODE_WIDTH/2;
    if(animatedNode.label === undefined){
      animatedNode.label = new PIXI.Text('@author vincenzopalazzo', { fontFamily: "Arial", fontSize: "20px" ,  fill: 0xfffff} );
      animatedNode.label.x = x;
      animatedNode.label.y = y + NODE_WIDTH/2;
      ctx.addChild(animatedNode.label);
    }else{
      animatedNode.label.x = x;
      animatedNode.label.y = y + NODE_WIDTH/2;
    }
  });

  animatedNode.on('unhover', function(animatedNode, ctx){
     ctx.removeChild(animatedNode.label);
      delete animatedNode.label;
  });

  ctx.mouseover = function(events) {
    console.debug('I\'call the hover events');
    animatedNode.fire('hover', events, animatedNode, ctx);
  }

  ctx.mouseout = function() {
    console.debug('I\'call the unhover events');
    animatedNode.fire('unhover', animatedNode, ctx);
  }
}
