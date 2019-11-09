// this is just a demo. To run it execute from the root of repository:
//
// > npm start
//
// Then open ./example/index.html
//

module.exports.main = function () {
  var graph = require('ngraph.generators').balancedBinTree(5);
  //var graph = require('ngraph.generators').grid(20, 20);
  var createPixiGraphics = require('../');
  var setting = {
    rendererOptions: {
      backgroundColor: 0x323232,
      antialias: true,
    },
    labelConf: {
      enable: true,
      style: { fontFamily: "Roboto", fontSize: "16px" ,  fill: 0xFFFFFF}
    }, 
    oriented: true,
  }
  var pixiGraphics = createPixiGraphics(graph, setting);
  pixiGraphics.createLinkUI(require('./lib/createLinkUI'));
  pixiGraphics.renderLink(require('./lib/renderLink'));
  pixiGraphics.createNodeUI(require('./lib/createNodeUI'));
  pixiGraphics.renderNode(require('./lib/renderNode'));
  //pixiGraphics.renderLabel(require('./lib/renderLabel'));
  
  var layout = pixiGraphics.layout;

  // just make sure first node does not move:
  layout.pinNode(graph.getNode(1), true);

  // begin animation loop:
  pixiGraphics.run();
//You now can managed the renderer;
  pixiGraphics.stop();

  pixiGraphics.resume();
}
