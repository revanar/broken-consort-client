import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      books: this.store.findAll('book'),
      editors: this.store.findAll('editor')
    });
  },
  controllerName: 'edit',
  deactivate() {
    this.controller.send('saveAll', 'book');
  }
});
