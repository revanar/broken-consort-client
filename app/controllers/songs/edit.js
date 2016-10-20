import Ember from 'ember';

export default Ember.Controller.extend({
  isUploading: false,
  actions: {
    createRelation(song, type, value){
      let e = this;
      e.get('store').createRecord(type, {
          name: value
      }).save().then(function(result){
        song.set(type, result);
        e.send('autoSave');
      });
    },
    createOnEnter(song, type, select, key){
      let e = this;
      if (key.keyCode === 13 && select.isOpen &&
      !select.highlighted && !Ember.isBlank(select.searchText)) {
        e.get('store').createRecord(type, {
          name: select.searchText
        }).save().then(function(result){
          song.get(type+'s').pushObject(result);
          e.send('autoSave');
        });
      }
    },
    updateField(song, type, value){
      song.set(type, value);
      this.send('autoSave');
    },
    updateHasMany(song, type, values){
      let array = values.mapBy('id'); //NEXT UP: compre the values with the song's existing relations, use removeObjec to remove ones that no longer exist, and pushObject to add new ones.
      console.log(array.sort());
      values.forEach(function(value){
        song.get(type).pushObject(value);
      });
      this.send('autoSave');
    },
    saveAll(){
      let e = this;
      this.get('model.songs').forEach(function(song){
        if (song.get('hasDirtyAttributes')){
          song.save();
          $('*[id=save-flash-'+song.id).show(500).delay(1000).hide(500);
          $('*[id^=pdf-progress-]').empty();
          e.set('queuedSave', false);
        }
      });
    },
    autoSave(){
      if (!this.get('queuedSave') && !this.get('isUploading')){
        Ember.run.later(this, function(){
          this.send('saveAll');
        }, 5000);
        this.set('queuedSave', true);
      }
    },
    uploadPDF(song, file){
      let e = this; //pushes 'this' into a variable so I can use it in a function
      e.set('isUploading', true); //disables submit until uploading is finished currently not implimented.  Re-add as feature to keep user from leaving the page
      let reader = new FileReader(); //instantiates the FileReader

      reader.onload = function(){
        song.set('pdf', reader.result); //puts the base64 data url into the model
        e.set('isUploading', false); //re-enables submitting
        e.send('autoSave');
      };

      reader.onprogress = function(data){
        if (data.lengthComputable){
          let progress = parseInt(((data.loaded/data.total)*100),10);
          $('#pdf-progress-'+song.id).text(progress+'%'); //shows progress percentage when uploading
        }
      };
      reader.readAsDataURL(file[0]); //converts file to uploadable format
    },
    userHasEnteredData(){
      let answer = "maybe";
      return answer;
    }
  }
});
