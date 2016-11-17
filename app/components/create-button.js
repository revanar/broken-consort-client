import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  actions: {
    createRecord(type, input, model){
      let record = this.get('store').createRecord(type, {name:input});
      this.get('controller').get('model.songs').pushObject(record);
    },
  }
});
