'use strict';

describe('overlay indicator', function() {
  var container, indicator, Y;

  before(function(done) {
    Y = YUI(GlobalConfig).use(['browser-overlay-indicator', 'node'],
        function(Y) {
          done();
        });
  });

  beforeEach(function() {
    container = Y.Node.create('<div id="container"></div>');
    Y.one('body').prepend(container);
  });

  afterEach(function() {
    if (indicator) {
      indicator.destroy();
    }
    container.remove(true);
  });

  it('exists', function() {
    indicator = new Y.juju.browser.widgets.OverlayIndicator();
    assert.isObject(indicator);
  });

  it('gets target from config', function() {
    indicator = new Y.juju.browser.widgets.OverlayIndicator(
        {target: container});
    indicator.render();
    assert.equal(container, indicator.get('target'));
  });

  it('appends itself to target parent', function() {
    var child = Y.Node.create('<div/>');
    container.appendChild(child);
    indicator = new Y.juju.browser.widgets.OverlayIndicator(
        {target: child});
    indicator.render();
    assert.equal(container, indicator.get('boundingBox').get('parentNode'));
  });

  it('has a loading icon', function() {
    indicator = new Y.juju.browser.widgets.OverlayIndicator(
        {target: container});
    indicator.render();
    var content = indicator.get('boundingBox'),
        test = content.getContent(),
        img = content.one('img');
    var img_url = img.get('src').split('/').slice(3, 7).join('/');
    assert.equal(
        'juju-ui/assets/images/loading-spinner.gif',
        img_url);
  });

  it('starts invisible', function() {
    // OverlayIndicator widgets should start hidden.
    indicator = new Y.juju.browser.widgets.OverlayIndicator(
        {target: container});
    indicator.render();
    assert.isFalse(indicator.get('visible'));
    assert.isTrue(indicator.get('boundingBox').hasClass(
        'yui3-overlay-indicator-hidden'));
  });

  it('shows on setBusy', function() {
    indicator = new Y.juju.browser.widgets.OverlayIndicator(
        {target: container});
    indicator.render();
    indicator.setBusy();
    assert.isTrue(indicator.get('visible'));
    assert.isFalse(indicator.get('boundingBox').hasClass(
        'yui3-overlay-indicator-hidden'));
  });

  it('size matches on setBusy', function() {
    indicator = new Y.juju.browser.widgets.OverlayIndicator(
        {target: container});
    indicator.render();
    // Mess with the size of target div.
    var expected_width = 800,
        expected_height = 600;
    container.set('offsetWidth', expected_width);
    container.set('offsetHeight', expected_height);
    assert.notEqual(
        expected_width,
        indicator.get('boundingBox').get('offsetWidth'));
    assert.notEqual(
        expected_height,
        indicator.get('boundingBox').get('offsetHeight'));
    indicator.setBusy();
    assert.equal(
        expected_width,
        indicator.get('boundingBox').get('offsetWidth'));
    assert.equal(
        expected_height,
        indicator.get('boundingBox').get('offsetHeight'));
  });

  it('position matches on setBusy', function() {
    // OverlayIndicator should always reposition itself before setBusy.
    indicator = new Y.juju.browser.widgets.OverlayIndicator(
        {target: container});
    indicator.render();
    // Change the position of target div.
    var expected_xy = [100, 300],
        actual_xy = indicator.get('boundingBox').getXY();
    container.setXY(expected_xy);
    assert.notEqual(expected_xy[0], actual_xy[0]);
    assert.notEqual(expected_xy[1], actual_xy[1]);
    indicator.setBusy();
    var final_xy = indicator.get('boundingBox').getXY();
    assert.equal(expected_xy[0], final_xy[0]);
    assert.equal(expected_xy[1], final_xy[1]);
  });

  it('hides on success', function() {
    indicator = new Y.juju.browser.widgets.OverlayIndicator(
        {target: container});
    indicator.render();
    indicator.setBusy();
    indicator.success();
    assert.isFalse(indicator.get('visible'));
    assert.isTrue(indicator.get('boundingBox').hasClass(
        'yui3-overlay-indicator-hidden'));
  });

  it('can have a success callback', function() {
    var called = false;
    indicator = new Y.juju.browser.widgets.OverlayIndicator({
      target: container,
      success_action: function() {
        called = true;
      }
    });
    indicator.render();
    indicator.success();
    assert.isTrue(called);
  });

  it('hides on error', function() {
    indicator = new Y.juju.browser.widgets.OverlayIndicator(
        {target: container});
    indicator.render();
    indicator.setBusy();
    indicator.error();
    assert.isFalse(indicator.get('visible'));
    assert.isTrue(indicator.get('boundingBox').hasClass(
        'yui3-overlay-indicator-hidden'));
  });

  it('can have an error callback', function() {
    var called = false;
    indicator = new Y.juju.browser.widgets.OverlayIndicator({
      target: container,
      error_action: function() {
        called = true;
      }
    });
    indicator.render();
    indicator.error();
    assert.isTrue(called);
  });
});