import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      editors: this.store.findAll('editor', {include: 'books'}),
      books: this.store.findAll('book', {include: 'editor'})
    });
  },
  controllerName: 'edit',
  deactivate(){
    this.controller.send('saveAll', 'editor');
  }
});
