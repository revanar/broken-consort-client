import { moduleForModel, test } from 'ember-qunit';

moduleForModel('editor', 'Unit | Model | editor', {
  // Specify the other units that are required for this test.
  needs: ['model:book']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
