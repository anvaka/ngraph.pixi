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

