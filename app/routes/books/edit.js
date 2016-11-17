import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      books: this.store.findAll('book', {include: 'editor,songs'}),
      editors: this.store.findAll('editor'),
      songs: this.store.query('song', {sort: 'song_no'})
    });
  },
  controllerName: 'edit',
  deactivate() {
    this.controller.send('saveAll', 'book');
  }
});
