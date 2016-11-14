import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('book', {include: 'editor,songs'});
  },
  queryParams: {
    q_all: {replace:true}
  }
});
