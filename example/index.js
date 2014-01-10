// this is just a demo. To run it execute from the root of repository:
//
// > npm start
//
// Then open ./example/index.html
//
module.exports.main = function () {
  var graph = require('ngraph.generators').balancedBinTree(6);
  var createPixiGraphics = require('../');

  var pixiGraphics = createPixiGraphics(graph);
  var layout = pixiGraphics.layout;

  // just make sure first node does not move:
  layout.pinNode(graph.getNode(1), true);

  // begin animation loop:
  pixiGraphics.run();
}
