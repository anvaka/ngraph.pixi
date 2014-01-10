// this is just a demo. To run it execute from the root of repository:
//
// > npm start
//
// Then open ./example/index.html
//
module.exports.main = function () {
  var graph = require('ngraph.generators').balancedBinTree(6),
      layout = createLayout(graph);

  var createPixiGraphics = require('../');
  var graphics = createPixiGraphics(graph, layout);
  layout.pinNode(graph.getNode(1), true);

  // begin animation loop:
  renderFrame();

  function renderFrame() {
    layout.step();
    graphics.renderFrame();
    requestAnimFrame(renderFrame);
  }
}

function createLayout(graph) {
  var layout = require('ngraph.forcelayout'),
      physics = require('ngraph.physics.simulator');

  return layout(graph, physics({
          springLength: 30,
          springCoeff: 0.0008,
          dragCoeff: 0.01,
          gravity: -1.2,
          theta: 1
        }));
}
