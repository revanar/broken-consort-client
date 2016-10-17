import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      songs: this.store.query('song', {include: 'book,book.editor,composer,languages,tags', sort:'book.name,song_no'}),
      composers: this.store.findAll('composer'),
      books: this.store.findAll('book'),
      tags: this.store.findAll('tag'),
      languages: this.store.findAll('language')
    });
  }
});
