import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').query('song', {include: 'book,book.editor,composer,languages,tags', sort:'book.name,song_no'});
  }

});
