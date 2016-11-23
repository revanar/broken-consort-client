import Ember from 'ember';

const ColumnHiderComponent = Ember.Component.extend({
  didReceiveAttrs(){
    this.send('executeHide');
  },
  tagName: '',
  visible: true,
  actions: {
    executeHide(){
      let regExp = new RegExp(this.get('value'), 'i');
      if (regExp.test(this.get('queryParam'))){
        this.set('visible', false);
      } else {
        this.set('visible', true);
      }
    }
  }

});

ColumnHiderComponent.reopenClass({
  positionalParams: ['value', 'queryParam']
});

export default ColumnHiderComponent;
