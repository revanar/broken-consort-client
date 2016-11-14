import Ember from 'ember';

export default Ember.Route.extend({
  model (){
    return Ember.RSVP.hash({
      tags: this.store.findAll('tag'),
      songs: this.store.findAll('song')
    });
  },
  controllerName: 'edit',
  deactivate() {
    this.controller.send('saveAll', 'tag');
  }
});
