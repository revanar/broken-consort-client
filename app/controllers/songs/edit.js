import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createComposer(song, composer){
      this.get('store').createRecord('composer', {
          name: composer
      }).save().then(function(result){
        song.set('composer', result);
        song.save();
      });
    },
    update(song){
      song.save();
    }
  }
});
