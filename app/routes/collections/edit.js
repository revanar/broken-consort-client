import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('collection');
  },
  controllerName: 'edit',
  setupController: function(controller, model){
    this._super(controller, model);
    controller.set('collections', model.toArray());
  },
  deactivate() {
    this.controller.send('saveAll', 'collection');
  }
});
