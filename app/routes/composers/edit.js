import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      composers: this.store.findAll('composer', {include: 'songs'}),
      songs: this.store.findAll('song')
    });
  },
  controllerName: 'edit',
  deactivate(){
    this.controller.send('saveAll', 'composer');
  }
});
