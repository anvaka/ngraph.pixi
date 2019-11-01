module.exports = function (animatedNode, ctx) {

  ctx.on('hover', function(animatedNode, ctx){
    let x = animatedNode.pos.x;
    let y = animatedNode.pos.y / 2;
    if(animatedNode.label === undefined){
      animatedNode.label = new PIXI.Text('@author vincenzopalazzo', { fontFamily: "Arial", fontSize: "20px" ,  fill: 0x000000} );
      animatedNode.label.x = x;
      animatedNode.label.y = - y;
      ctx.addChild(animatedNode.label);
    }else{
      animatedNode.label.x = x;
      animatedNode.label.y = y;
    }
  });

  ctx.on('unhover', function(animatedNode, ctx){
      ctx.removeChild(animatedNode.label);
      delete animatedNode.label;

  });

  ctx.mouseover = function() {
    console.debug('I\'call the hover events');
    this.fire('hover', animatedNode, ctx);
  }

  ctx.mouseout = function() {
    console.debug('I\'call the unhover events');
    this.fire('unhover', animatedNode, ctx);
  }
  
}
