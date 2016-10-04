import { moduleFor, test } from 'ember-qunit';

moduleFor('route:index', 'Unit | Route | index', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('should transition to songs route', function(assert) {
  let route = this.subject({
    replaceWith(routeName) {
      assert.equal(routeName, 'songs', 'replace with route name songs');
    }
  });
  route.beforeModel();
});
