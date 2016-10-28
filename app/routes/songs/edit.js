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
  },
  controllerName: 'edit',
  actions: {
    willTransition(transition) {
      if (this.controller.get('queuedSave') &&
        !confirm('Are you sure you want to abandon progress?')) {
        transition.abort();
      } else {
        // Bubble the `willTransition` action so that
        // parent routes can decide whether or not to abort.
        return true;
      }
    }
  }
});
