import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').query('song', {include: 'book,book.editor,composer,languages,tags'});
  },
  queryParams: {
    sortBy: {as:'s', replace:true},
    hidden: {replace:true},
    filter: {replace:true}
  }
});
