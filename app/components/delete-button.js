import Ember from 'ember';

export default Ember.Component.extend({
  showModal: false,
  actions: {
    toggleModal(){
      this.toggleProperty('showModal');
    },
    sendAction(){
      this.send('toggleModal');
      this.get('onconfirm')();
    }
  }
});
