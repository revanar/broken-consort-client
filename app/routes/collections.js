import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('collection');
  },
  queryParams: {
    q_all: {replace:true}
  }
});
