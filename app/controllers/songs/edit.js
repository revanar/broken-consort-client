import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createComposer(song, composer){
      this.get('store').createRecord('composer', {
          name: composer
      }).save().then(function(result){
        song.set('composer', result);
        //note: removed song.save(); so that all saving can be done with update action.
      });
    },
    createLanguage(song, language){
      this.get('store').createRecord('language', {
          name: language
      }).save().then(function(result){
        song.set('language', result);
        //note: removed song.save(); so that all saving can be done with update action.
      });
    },
    createOnEnter(song, select, key){
      if (key.keyCode === 13 && select.isOpen &&
      !select.highlighted && !Ember.isBlank(select.searchText)) {
        console.log(select.searchText);
        this.get('store').createRecord('tag', {
          name: select.searchText
        }).save().then(function(result){
          song.get('tags').pushObject(result);
        });
      }
    },
    update(song){
      song.save();
    }
  }
});
