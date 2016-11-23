import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      composers: this.store.findAll('composer', {include: 'songs'}),
      songs: this.store.findAll('song')
    });
  },
  controllerName: 'edit',
  setupController: function(controller, model){
    this._super(controller, model);
    controller.set('composers', model.composers.toArray());
  },
  deactivate(){
    this.controller.send('saveAll', 'composer');
  }
});
