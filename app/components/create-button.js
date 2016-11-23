import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  unsavedRecord: Ember.computed('store', function(){
    return this.get('store').peekAll('model').filterBy('isNew', true);
  }),

  actions: {
    createRecord(type, input, model){
      let record = this.get('store').createRecord(type, {name:input});
      this.get('model').save(record);
    },
  }
});
