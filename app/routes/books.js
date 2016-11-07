import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('book', {include: 'editor'});
  },
  queryParams: {
    sortBy: {as:'s', replace:true},
    q_all: {replace:true},
    q_title: {replace:true},
    q_editor: {replace:true},
    q_year: {replace:true}
  }
});
