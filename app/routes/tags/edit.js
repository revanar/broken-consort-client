import Ember from 'ember';

export default Ember.Route.extend({
  model (){
    return this.get('store').findAll('tag', {include: 'songs'});
  },
  controllerName: 'edit',
  deactivate() {
    this.controller.send('saveAll', 'tag');
  }
});
