import Ember from 'ember';

const ListTagsComponent = Ember.Component.extend({
  tagName: 'ul',
  classNames: ['csv']
});

ListTagsComponent.reopenClass({
  positionalParams: ['record']
});

export default ListTagsComponent;
