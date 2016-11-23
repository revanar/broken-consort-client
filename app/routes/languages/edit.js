import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      languages: this.store.findAll('language', {include: 'songs'}),
      songs: this.store.findAll('song', {include: 'languages'})
    });
  },
  controllerName: 'edit',
  setupController: function(controller, model){
    this._super(controller, model);
    controller.set('languages', model.languages.toArray());
  },
  deactivate(){
    this.controller.send('saveAll', 'language');
  }
});
