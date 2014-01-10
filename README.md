# ngraph.pixi

This is a 2d graph renderer which uses [PIXI.js](https://github.com/GoodBoyDigital/pixi.js/tree/master/src/pixi)
as a rendering engine.

# Example

This code will render a graph, and will let users zoom in/zoom out with mouse wheel.
Each node of the graph can be individually dragged.

``` js
  // let's create a simple graph with two nodes, connected by edge:
  var graph = require('ngraph.graph')();
  graph.addLink(1, 2);

  // Now create a force directed layout:
  var layout = require('ngraph.forcelayout')(graph);

  // Create a pixi renderer:
  var pixiGraphics = require('ngraph.pixi')(graph, layout);

  // And launch animation loop:
  renderFrame();

  function renderFrame() {
    layout.step();
    pixiGraphics.renderFrame();
    requestAnimFrame(renderFrame);
  }
```

To see full source code with html markup, please refer to [example](./example/)
folder.

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.pixi
```

To compile (or browserify) local examples run:

```
npm start
```

# Customization

This renderer allows you to customize appearance of nodes and edges. E.g. to render
custom colored nodes:

``` js
// add two nodes with associated data:
graph.addNode('user1', {color: 0x00FFFF});
graph.addNode('user2', {color: 0x00FF00});

// Construct UI model for node:
pixiGraphics.createNodeUI(function (node) {
  return {
    width: 2 + Math.random() * 20,
    color: node.data.color // use settings from node's data
  };
});

// tell pixi how we want to render each UI model:
pixiGraphics.renderNode(function (nodeUIModel, ctx) {
  ctx.lineStyle(0);
  ctx.beginFill(nodeUIModel.color);
  var x = nodeUIModel.pos.x - nodeUIModel.width/2,
      y = nodeUIModel.pos.y - nodeUIModel.width/2;

  ctx.drawRect(x, y, nodeUIModel.width, nodeUIModel.width);
});
```

# What is missing?

This library was created as part of [ngraph](https://github.com/anvaka/ngraph)
project. If you like PIXI and want to help with graph rendering using, your 
contribution is absolutely welcomed and appreciated. Here are just some things which
could be done better:

* Renderer currently works with `PIXI.Graphics`, which does not let rendering
custom text on the screen
* `PIXI.Graphics` has decent pressure on garbage collector, since all primitives
are rerendered on each frame. This can be improved by impleleming custom `PIXI.DisplayObject` - 
[more info](https://github.com/GoodBoyDigital/pixi.js/issues/479#issuecomment-31973283)
* Mouse/touch events are not exposed externally from the renderer. It will be
nice to let clients of this library to react on user actions.

# license

MIT
