import Ember from 'ember';

export default Ember.Controller.extend({
  isUploading: false,
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
      $('*[id^=pdf-progress-]').empty(); //clears any pdf loading percentages for cosmetic reasons
    },
    uploadPDF(song, file){
      let toggle = this; //pushes 'this' into a variable so I can use it in a function
      toggle.set('isUploading', true); //disables submit until uploading is finished
      let reader = new FileReader(); //instantiates the FileReader

      reader.onload = function(e){
        song.set('pdf', reader.result); //puts the base64 data url into the model
        toggle.set('isUploading', false); //re-enables submitting
      };

      reader.onprogress = function(data){
        if (data.lengthComputable){
          let progress = parseInt(((data.loaded/data.total)*100),10);
          $('#pdf-progress-'+song.id).text(progress+'%'); //shows progress percentage when uploading
        }
      };
      reader.readAsDataURL(file[0]); //converts file to uploadable format
    }
  }
});
