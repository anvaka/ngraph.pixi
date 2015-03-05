var NODE_WIDTH = 10;
var PIXI = require('pixi.js');

module.exports = function (graph, settings) {
  var merge = require('ngraph.merge');

  // Initialize default settings:
  settings = merge(settings, {
    // What is the background color of a graph?
    background: 0x000000,

    // Default physics engine settings
    physics: {
      springLength: 30,
      springCoeff: 0.0008,
      dragCoeff: 0.01,
      gravity: -1.2,
      theta: 1
    }
  });

  // Where do we render our graph?
  if (typeof settings.container === 'undefined') {
    settings.container = document.body;
  }

  // If client does not need custom layout algorithm, let's create default one:
  var layout = settings.layout;

  if (!layout) {
    var createLayout = require('ngraph.forcelayout'),
        physics = require('ngraph.physics.simulator');

    layout = createLayout(graph, physics(settings.physics));
  }

  var width = settings.container.clientWidth,
      height = settings.container.clientHeight;

  var stage = new PIXI.Stage(settings.background, true);
  var renderer = PIXI.autoDetectRenderer(width, height, null, false, true);

  settings.container.appendChild(renderer.view);

  var graphics = new PIXI.Graphics();
  graphics.position.x = width/2;
  graphics.position.y = height/2;
  graphics.scale.x = 1;
  graphics.scale.y = 1;
  stage.addChild(graphics);

  // Default callbacks to build/render nodes
  var nodeUIBuilder = defaultCreateNodeUI,
      nodeRenderer  = defaultNodeRenderer,
      linkUIBuilder = defaultCreateLinkUI,
      linkRenderer  = defaultLinkRenderer;

  // Storage for UI of nodes/links:
  var nodeUI = {}, linkUI = {};

  graph.forEachNode(initNode);
  graph.forEachLink(initLink);

  listenToGraphEvents();

  var pixiGraphics = {
    /**
     * Allows client to start animation loop, without worrying about RAF stuff.
     */
    run: animationLoop,

    /**
     * For more sophisticated clients we expose one frame rendering as part of
     * API. This may be useful for clients who have their own RAF pipeline.
     */
    renderOneFrame: renderOneFrame,

    /**
     * This callback creates new UI for a graph node. This becomes helpful
     * when you want to precalculate some properties, which otherwise could be
     * expensive during rendering frame.
     *
     * @callback createNodeUICallback
     * @param {object} node - graph node for which UI is required.
     * @returns {object} arbitrary object which will be later passed to renderNode
     */
    /**
     * This function allows clients to pass custom node UI creation callback
     *
     * @param {createNodeUICallback} createNodeUICallback - The callback that
     * creates new node UI
     * @returns {object} this for chaining.
     */
    createNodeUI : function (createNodeUICallback) {
      nodeUI = {};
      nodeUIBuilder = createNodeUICallback;
      graph.forEachNode(initNode);
      return this;
    },

    /**
     * This callback is called by pixiGraphics when it wants to render node on
     * a screen.
     *
     * @callback renderNodeCallback
     * @param {object} node - result of createNodeUICallback(). It contains anything
     * you'd need to render a node
     * @param {PIXI.Graphics} ctx - PIXI's rendering context.
     */
    /**
     * Allows clients to pass custom node rendering callback
     *
     * @param {renderNodeCallback} renderNodeCallback - Callback which renders
     * node.
     *
     * @returns {object} this for chaining.
     */
    renderNode: function (renderNodeCallback) {
      nodeRenderer = renderNodeCallback;
      return this;
    },

    /**
     * This callback creates new UI for a graph link. This becomes helpful
     * when you want to precalculate some properties, which otherwise could be
     * expensive during rendering frame.
     *
     * @callback createLinkUICallback
     * @param {object} link - graph link for which UI is required.
     * @returns {object} arbitrary object which will be later passed to renderNode
     */
    /**
     * This function allows clients to pass custom node UI creation callback
     *
     * @param {createLinkUICallback} createLinkUICallback - The callback that
     * creates new link UI
     * @returns {object} this for chaining.
     */
    createLinkUI : function (createLinkUICallback) {
      linkUI = {};
      linkUIBuilder = createLinkUICallback;
      graph.forEachLink(initLink);
      return this;
    },

    /**
     * This callback is called by pixiGraphics when it wants to render link on
     * a screen.
     *
     * @callback renderLinkCallback
     * @param {object} link - result of createLinkUICallback(). It contains anything
     * you'd need to render a link
     * @param {PIXI.Graphics} ctx - PIXI's rendering context.
     */
    /**
     * Allows clients to pass custom link rendering callback
     *
     * @param {renderLinkCallback} renderLinkCallback - Callback which renders
     * link.
     *
     * @returns {object} this for chaining.
     */
    renderLink: function (renderLinkCallback) {
      linkRenderer = renderLinkCallback;
      return this;
    },

    /**
     * Tries to get node at (x, y) graph coordinates. By default renderer assumes
     * width and height of the node is 10 pixels. But if your createNodeUICallback
     * returns object with `width` and `height` attributes, they are considered
     * as actual dimensions of a node
     *
     * @param {Number} x - x coordinate of a node in layout's coordinates
     * @param {Number} y - y coordinate of a node in layout's coordinates
     * @returns {Object} - actual graph node located at (x, y) coordinates.
     * If there is no node in that are `undefined` is returned.
     *
     * TODO: This should be part of layout itself
     */
    getNodeAt: getNodeAt,

    /**
     * [Read only] Current layout algorithm. If you want to pass custom layout
     * algorithm, do it via `settings` argument of ngraph.pixi.
     */
    layout: layout,

    // TODO: These properties seem to only be required of graph input. I'd really
    // like to hide them, but not sure how to do it nicely
    domContainer: renderer.view,
    graphGraphics: graphics,
    stage: stage
  };

  // listen to mouse events
  var graphInput = require('./lib/graphInput');
  graphInput(pixiGraphics, layout);

  return pixiGraphics;

///////////////////////////////////////////////////////////////////////////////
// Public API is over
///////////////////////////////////////////////////////////////////////////////

  function animationLoop() {
    requestAnimationFrame(animationLoop);
    layout.step();
    renderOneFrame();
  }

  function renderOneFrame() {
    graphics.clear();

    Object.keys(linkUI).forEach(renderLink);
    Object.keys(nodeUI).forEach(renderNode);

    renderer.render(stage);
  }

  function renderLink(linkId) {
    linkRenderer(linkUI[linkId], graphics);
  }

  function renderNode(nodeId) {
    nodeRenderer(nodeUI[nodeId], graphics);
  }

  function initNode(node) {
    var ui = nodeUIBuilder(node);
    // augment it with position data:
    ui.pos = layout.getNodePosition(node.id);
    // and store for subsequent use:
    nodeUI[node.id] = ui;
  }

  function initLink(link) {
    var ui = linkUIBuilder(link);
    ui.from = layout.getNodePosition(link.fromId);
    ui.to = layout.getNodePosition(link.toId);
    linkUI[link.id] = ui;
  }

  function defaultCreateNodeUI() {
    return {};
  }

  function defaultCreateLinkUI() {
    return {};
  }

  function defaultNodeRenderer(node) {
    var x = node.pos.x - NODE_WIDTH/2,
        y = node.pos.y - NODE_WIDTH/2;

    graphics.beginFill(0xFF3300);
    graphics.drawRect(x, y, NODE_WIDTH, NODE_WIDTH);
  }

  function defaultLinkRenderer(link) {
    graphics.lineStyle(1, 0xcccccc, 1);
    graphics.moveTo(link.from.x, link.from.y);
    graphics.lineTo(link.to.x, link.to.y);
  }

  function getNodeAt(x, y) {
    var half = NODE_WIDTH/2;
    // currently it's a linear search, but nothing stops us from refactoring
    // this into spatial lookup data structure in future:
    for (var nodeId in nodeUI) {
      if (nodeUI.hasOwnProperty(nodeId)) {
        var node = nodeUI[nodeId];
        var pos = node.pos;
        var width = node.width || NODE_WIDTH;
        half = width/2;
        var insideNode = pos.x - half < x && x < pos.x + half &&
                         pos.y - half < y && y < pos.y + half;

        if (insideNode) {
          return graph.getNode(nodeId);
        }
      }
    }
  }

  function listenToGraphEvents() {
    graph.on('changed', onGraphChanged);
  }

  function onGraphChanged(changes) {
    for (var i = 0; i < changes.length; ++i) {
      var change = changes[i];
      if (change.changeType === 'add') {
        if (change.node) {
          initNode(change.node);
        }
        if (change.link) {
          initLink(change.link);
        }
      } else if (change.changeType === 'remove') {
        if (change.node) {
          delete nodeUI[change.node.id];
        }
        if (change.link) {
          delete linkUI[change.link.id];
        }
      }
    }
  }
};
