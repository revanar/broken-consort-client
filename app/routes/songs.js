import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('song', {include: 'book,book.editor,composer,language'});
  }
});
