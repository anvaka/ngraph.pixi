# ngraph.pixi

This is a 2d graph renderer which uses [PIXI.js](https://github.com/GoodBoyDigital/pixi.js)
as a rendering engine.

[![build status](https://secure.travis-ci.org/anvaka/ngraph.pixi.png)](http://travis-ci.org/anvaka/ngraph.pixi)

# Example

This code will render interactive graph:

``` js
  // let's create a simple graph with two nodes, connected by edge:
  var graph = require('ngraph.graph')();
  graph.addLink(1, 2);

  // Create a pixi renderer:
  var pixiGraphics = require('ngraph.pixi')(graph);

  // And launch animation loop:
  pixiGraphics.run();
```

To run it, please refer to [example](./example/) folder.

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

`ngraph.pixi` allows you to customize various aspects of graph appearance

## Nodes/Link

When working with `ngraph.graph` each node may have associated data. This data
is considered a data model of a node. `ngraph.pixi` lets clients convert associated
data model into UI model for node (`createNodeUI()`) or link (`createLinkUI()`).

Results of these methods are then used to actually render a node (`renderNode()`)
or a link (`renderLink()`).

``` js
// add two nodes with associated data model
graph.addNode('user1', {sex: 'male'});
graph.addNode('user2', {sex: 'female'});

// Construct UI model for node:
pixiGraphics.createNodeUI(function (node) {
  return {
    width: 2 + Math.random() * 20,
    // use settings from node's data
    color: node.data.sex === 'female' ? 0xFF0000 : 0x0000FF
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

There are several reasons for such separation of concerns. One is performance: By
constructing UI model once we are saving CPU cycles at rendering time. Another reason
for separation - you can have multiple renderers render the same graph without
interfering with each other.

## Physics

You can change default physics engine parameters by passing `physics` object inside
settings:

``` js
  var createPixiGraphics = require('ngraph.pixi');
  var pixiGraphics = createPixiGraphics(graph, {
    physics: {
      springLength: 30,
      springCoeff: 0.0008,
      dragCoeff: 0.01,
      gravity: -1.2,
    }
  })
```

To read more information about each of these and even more properties, please
refer to [physics engine documentation](https://github.com/anvaka/ngraph.physics.simulator/blob/b674df18e3b64c2ec86ef1a298736b5879eafe01/index.js#L15-L49).

# What is missing?

This library was created as part of [ngraph](https://github.com/anvaka/ngraph)
project. If you like PIXI and want to help with graph rendering, your 
contribution is absolutely welcomed and appreciated. Here are just some things which
could be done better:

* Renderer currently works with `PIXI.Graphics`, which does not let rendering
custom text on the screen
* `PIXI.Graphics` has decent pressure on garbage collector, since all primitives
are rerendered on each frame. This can be improved by implementing custom `PIXI.DisplayObject` - 
[more info](https://github.com/GoodBoyDigital/pixi.js/issues/479#issuecomment-31973283)
* Mouse events are not exposed externally from the renderer. It will be
nice to let clients of this library to react on user actions.
* While touch event is supported by PIXI.js it needs to be added to the renderer.
* Need methods like pan/zoom to be exposed via API

# license

MIT
