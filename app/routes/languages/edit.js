import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      languages: this.store.findAll('language'),
      songs: this.store.findAll('song')
    });
  },
  controllerName: 'edit',
  deactivate(){
    this.controller.send('saveAll', 'language');
  }
});
