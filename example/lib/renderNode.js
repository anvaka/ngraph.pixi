module.exports = function (animatedNode, ctx) {
  animatedNode.renderFrame();
  ctx.lineStyle(0);
  ctx.beginFill(animatedNode.color,1);
  ctx.drawCircle(animatedNode.pos.x, animatedNode.pos.y, animatedNode.width);
}

/**
 *  let x = animatedNode.pos.x;
  let y = animatedNode.pos.y;
  if(animatedNode.label === undefined){
    animatedNode.label = new PIXI.Text('Node Label', { fontFamily: "Arial", fontSize: "20px" ,  fill: 0x000000} );
    animatedNode.label.x = x;
    animatedNode.label.y = y + animatedNode.width/2;
    ctx.addChild(animatedNode.label);
  }else{
    animatedNode.label.x = x;
    animatedNode.label.y = y + animatedNode.width/2;
    animatedNode.label.updateText();
  }
 */