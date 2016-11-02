import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'a',
  classNames: ['list-sortable'],

  click() {
    //invoke controller function to set sort order
    this.get('onclick')(this.get('id'));
  }
});
