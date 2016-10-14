import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      songs: this.store.findAll('song', {include: 'book,book.editor,composer,languages,tags'}),
      books: this.store.findAll('book')
    });
  }
});
