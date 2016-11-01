import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('song', {include: 'book,book.editor,composer,languages,tags'});
  },
  queryParams: {
    sortBy: {as:'s', replace:true},
    searchTerm: {as:'q', replace:true}
  }
});
