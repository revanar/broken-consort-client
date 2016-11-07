import Ember from 'ember';

const ListSortableComponent = Ember.Component.extend({

  didReceiveAttrs(){
    let queryParam = this.get('queryParam');
    let sortBy = this.get('sortBy');
    let isAsc = sortBy + ':asc';
    let isDesc = sortBy + ':desc';
    if (queryParam === isAsc){
      this.set('sortDesc', false);
      this.set('sortAsc', true);
    } else if (queryParam === isDesc){
      this.set('sortAsc', false);
      this.set('sortDesc', true);
    } else {
      this.set('sortAsc', false);
      this.set('sortDesc', false);
    }
  },
  classNames: ['list-sortable'],
  classNameBindings: ['sortDesc', 'sortAsc'],
  sortDesc: false,
  sortAsc: false,
});

ListSortableComponent.reopenClass({
  positionalParams: ['queryParam', 'sortBy']
});

export default ListSortableComponent;
