import Ember from 'ember';

export default Ember.Component.extend({
  init(){
    this._super(...arguments);
    this.set('value', this.get('param'));
  },
  didRender(){
    this._super(...arguments);
    let value = this.get('value');
    let valid = new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');
    while (value.length > 0 && !valid.test(value)) value = value.slice(0,-1);
    this.set('value', value);
    this.get('onChange')(value);
  },
  tagName: 'th',
  type: 'text',
});
