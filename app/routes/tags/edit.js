import Ember from 'ember';

export default Ember.Route.extend({
  model (){
    return Ember.RSVP.hash({
      tags: this.store.findAll('tag'),
      songs: this.store.findAll('song')
    });
  },
  controllerName: 'edit',
  setupController: function(controller, model){
    this._super(controller, model);
    controller.set('tags', model.tags.toArray());
  },
  deactivate() {
    this.controller.send('saveAll', 'tag');
  }
});
