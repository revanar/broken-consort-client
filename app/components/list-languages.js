import Ember from 'ember';

const ListLanguagesComponent = Ember.Component.extend({
  tagName: 'ul',
  classNames: ['csv']
});

ListLanguagesComponent.reopenClass({
  positionalParams: ['record']
});

export default ListLanguagesComponent;
