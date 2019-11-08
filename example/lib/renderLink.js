const NODE_WIDTH = 10;

module.exports = function (link, ctx) {
  ctx.lineStyle(link.width, 0xcfd8dc, 1);
  ctx.moveTo(link.from.x, link.from.y);
  ctx.lineTo(link.to.x, link.to.y);
  
  if(link.oriented === true){
    //Add the arch to the link
    // first, let's compute normalized vector for our link:
    let dx = link.to.x - link.from.x;
    let dy = link.to.y - link.from.y;
    let l = Math.sqrt(dx * dx + dy * dy);

    if (l === 0) return; // if length is 0 - can't render arrows

    // This is our normal vector. It describes direction of the graph
    // link, and has length == 1:
    let nx = dx/l; let ny = dy/l;

    // Now let's draw the arrow:
    let arrowLength = 6;       // Length of the arrow
    let arrowWingsLength = 2;  // How far arrow wings are from the link?

    // This is where arrow should end. We do `(l - NODE_WIDTH)` to
    // make sure it ends before the node UI element.
    let ex = link.from.x + nx * (l - NODE_WIDTH / 1.5);
    let ey = link.from.y + ny * (l - NODE_WIDTH / 1.5);

    // Offset on the graph link, where arrow wings should be
    let sx = link.from.x + nx * (l - (NODE_WIDTH / 1.5) - arrowLength);
    let sy = link.from.y + ny * (l - (NODE_WIDTH / 1.5) - arrowLength);

    // orthogonal vector to the link vector is easy to compute:
    let topX = -ny;
    let topY = nx;

    // Let's draw the arrow:
    ctx.moveTo(ex, ey);
    ctx.lineTo(sx + topX * arrowWingsLength, sy + topY * arrowWingsLength);
    ctx.moveTo(ex, ey);
    ctx.lineTo(sx - topX * arrowWingsLength, sy - topY * arrowWingsLength);
  }
}
