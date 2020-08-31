// this is just a demo. To run it execute from the root of repository:
//
// > npm start
//
// Then open ./example/index.html
//
var PIXI = require('pixi.js');;

module.exports.main = function () {
  var graph = require('ngraph.generators').balancedBinTree(6);
  var createPixiGraphics = require('../');

  // Example of passing your own instance of PIXI
  //
  // var pixi = new PIXI.Application({ width: 200, height: 200});
  // document.body.appendChild(pixi.view);
  // var pixiGraphics = createPixiGraphics(graph, undefined, pixi.renderer, pixi.stage);
  
  var pixiGraphics = createPixiGraphics(graph);
  var layout = pixiGraphics.layout;

  // just make sure first node does not move:
  layout.pinNode(graph.getNode(1), true);

  // begin animation loop:
  pixiGraphics.run();
}
