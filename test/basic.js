var createPixiGraphics = require('..'),
    createGraph = require('ngraph.generators'),
    assert = require('assert');

test('Layout is created', function () {
  var graph = createGraph.path(2);
  var pixiGraphics = createPixiGraphics(graph);

  var layout = pixiGraphics.layout;

  assert.ok(layout, 'Layout is present');
  assert.ok(typeof layout.step === 'function', 'Layout is iterative');
});

test('Render inside custom dom element', function () {
  var graph = createGraph.path(2);
  var container = document.createElement('div');

  var pixiGraphics = createPixiGraphics(graph, {
    container: container
  });

  assert.ok(container.childNodes.length > 0 &&
            container.childNodes[0].nodeName.match(/^canvas$/i),
            'Pixi attached itself');
});

test('Respects physics settings', function () {
  var graph = createGraph.path(2);

  var physics = {
        springLength: 42,
        springCoeff: 1,
        gravity: -9.8,
        theta: 0.8,
        dragCoeff: 0,
        timeStep : 20
      };

  var pixiGraphics = createPixiGraphics(graph, {
    physics: physics
  });

  var simulator = pixiGraphics.layout.simulator;
  assert.equal(simulator.springLength(), physics.springLength, 'Spring length');
  assert.equal(simulator.springCoeff(), physics.springCoeff, 'Spring coeff');
  assert.equal(simulator.gravity(), physics.gravity, 'Gravity');
  assert.equal(simulator.theta(), physics.theta, 'Theta');
  assert.equal(simulator.dragCoeff(), physics.dragCoeff, 'Drag');
  assert.equal(simulator.timeStep(), physics.timeStep, 'TimeStep');
});

test('Gets node from graph coordinates', function () {
  var graph = require('ngraph.graph')();
  var mainNode = graph.addNode(1);

  var pixiGraphics = createPixiGraphics(graph);

  var layout = pixiGraphics.layout;

  layout.setNodePosition(mainNode.id, 0, 0);
  var node = pixiGraphics.getNodeAt(0, 0);
  assert.ok(node, 'Main node should be there');
});
