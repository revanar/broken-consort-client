import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('language', {include: 'songs'});
  },
  controllerName: 'edit',
  deactivate(){
    this.controller.send('saveAll', 'language');
  }
});
