import Ember from 'ember';

export default Ember.Controller.extend({
  isUploading: false,
  actions: {
    createOne(type, record, rel_type, rel_value){ //should look like {{action createOne "book" book "editor"}}. rel_value is provided by helper
      let _this = this;
      _this.get('store').createRecord(rel_type, {
        name: rel_value
      }).save().then(function(result){
        record.set(rel_type, result);
        record.send('becomeDirty');
        _this.send('autoSave', type);
      });
    },
    createMany(type, record, rel_type, select, key){
      console.log(type);
      console.log(record);
      console.log(rel_type);
      console.log(select);
      console.log(key);
      let _this = this;
      if (key.keyCode === 13 && select.isOpen &&
        !select.highlighted && !Ember.isBlank(select.searchText)) {
        _this.get('store').createRecord(rel_type, {
          name: select.searchText
        }).save().then(function(result){
          record.get(rel_type+'s').pushObject(result);
          record.send('becomeDirty');
          _this.send('autoSave', type);
        });
      }
    },
    updateOne(type, record, rel_type, rel_value){
      record.set(rel_type, rel_value);
      record.send('becomeDirty');
      this.send('autoSave', type);
    },
    updateMany(type, record, rel_type, rel_values){
      let _this = this;
      let updateSet = new Set(rel_values.mapBy('id')); //creates set based on new set of values
      let _thisxistingSet = new Set(record.get(rel_type+'s').mapBy('id'));//creates set based on existing set of values
      let addSet = new Set([...updateSet].filter(x => !existingSet.has(x))); //create addSet based on values that are in updateSet but not existingSet
      addSet.forEach(function(id){ //add relationships from addSet
        let rel = e.get('store').peekRecord(rel_type, id);
        record.get(rel_type+'s').pushObject(rel);
        record.send('becomeDirty');
      });
      let removeSet = new Set([...existingSet].filter(x => !updateSet.has(x))); //create removeSet based on values that are in the existingSet but not in updateSet
      removeSet.forEach(function(id){ //remove relationships from removeSet
        let rel = e.get('store').peekRecord(rel_type, id);
        record.get(rel_type+'s').removeObject(rel);
        record.send('becomeDirty');
      });
      this.send('autoSave', type);
    },
    uploadPDF(record, file){
      let _this = this; //pushes 'this' into a variable so I can use it in a function
      _this.set('isUploading', true); //disables submit until uploading is finished currently not implimented.  Re-add as feature to keep user from leaving the page
      let reader = new FileReader(); //instantiates the FileReader

      reader.onload = function(){
        record.set('pdf', reader.result); //puts the base64 data url into the model
        _this.set('isUploading', false); //re-enables submitting
        _this.send('save',record);
      };

      reader.onprogress = function(data){
        if (data.lengthComputable){
          let progress = parseInt(((data.loaded/data.total)*100),10);
          $('#pdf-progress-'+record.id).text(progress+'%'); //shows progress percentage when uploading
        }
      };
      reader.readAsDataURL(file[0]); //converts file to uploadable format
    },
    uploadThumb(record, file){
      let _this = this; //pushes 'this' into a variable so I can use it in a function
      _this.set('isUploading', true); //disables submit until uploading is finished currently not implimented.  Re-add as feature to keep user from leaving the page
      let reader = new FileReader(); //instantiates the FileReader

      reader.onload = function(){
        record.set('thumb', reader.result); //puts the base64 data url into the model
        _this.set('isUploading', false); //re-enables submitting
        _this.send('save', record);
      };

      reader.onprogress = function(data){
        if (data.lengthComputable){
          let progress = parseInt(((data.loaded/data.total)*100),10);
          $('#pdf-progress-'+record.id).text(progress+'%'); //shows progress percentage when uploading
        }
      };
      reader.readAsDataURL(file[0]); //converts file to uploadable format
    },
    autoSave(type){
      console.log('autosave activated!');
      if (!this.get('queuedSave') && !this.get('isUploading')){
        Ember.run.later(this, function(){ //auto-saves data 5 seconds after an auto-save request is recieved
          console.log("sending save all request");
          this.send('saveAll', type);
        }, 5000);
        this.set('queuedSave', true); //if an autosave is already queued, don't bother queueing another one.
      }
    },
    saveAll(type){
      let _this = this;
      this.get('model.'+type+'s').forEach(function(record){
        if (record.get('hasDirtyAttributes')){
          record.save();
          $('*[id=save-flash-'+record.id).show(500).delay(1000).hide(500);
          $('*[id^=pdf-progress-]').empty();
          _this.set('queuedSave', false);
        }
      });
    },
    save(record){
      record.save();
      $('*[id=save-flash-'+record.id).show(500).delay(1000).hide(500);
      $('*[id^=pdf-progress-]').empty();
    }
  }
});
