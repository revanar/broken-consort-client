import Ember from 'ember';

export default Ember.Controller.extend({
  notify: Ember.inject.service('notify'),
  isUploading: false,
  actions: {
    autoSave(type){
      if (!this.get('queuedSave') && !this.get('isUploading')) {
        this.get('notify').warning(`Saving all ${type}s...`);
        Ember.run.later(this, function () { //auto-saves data 5 seconds after an auto-save request is recieved
          this.send('saveAll', type);
        }, 3000);
        this.set('queuedSave', true); //if an autosave is already queued, don't bother queueing another one.
      }
    },
    //use to create a has-many relationship item
    //eg if you have a book and want to create a song for it, you could use {{action "createMany" "book" book "song"}}
    createMany(type, record, rel_type, select, key){
      console.log(type);
      console.log(record);
      console.log(rel_type);
      console.log(select);
      console.log(key);
      if (key.keyCode === 13 && select.isOpen && !select.highlighted && !Ember.isBlank(select.searchText)) {
        this.get('store').createRecord(rel_type, {
          name: select.searchText
        }).save().then((result) => {
          record.get(rel_type + 's').pushObject(result);
          record.send('becomeDirty');
          this.send('autoSave', type);
        });
      }
    },
    //use to create a has-one relationship item
    //eg if you have a book and want to create an editor for it, you could use {{action "createOne" "book" book "editor"}}
    createOne(type, record, rel_type, rel_value){
      this.get('store').createRecord(rel_type, {
        name: rel_value
      }).save().then((result) => {
        record.set(rel_type, result);
        record.send('becomeDirty');
        this.send('autoSave', type);
      });
    },
    //used for creating as new record without relation to an existing record
    //eg if you want to create a new song, you could use {{action "createRecord" "song"}}
    //Note: does not add any content to newly created record
    createRecord(type){
      this.get('store').createRecord(type).save();
    },
    //use for deleting an existing record
    //eg if you want to delete a song, you could use {{action "deleteRecord" song}}
    deleteRecord(record){
      record.destroyRecord();
    },
    //Immediately saves any modified records of the specified type to the server
    //eg if you want to save all songs, you could use {{action "saveAll" "song"}}
    saveAll(type){
      let didSave = false;
      //non-RSVP
      if (this.get('model.' + type + 's') === undefined) {
        this.get('model').forEach((record) => {
          if (record.get('hasDirtyAttributes')) {
            didSave = true;
            record.save();
          }
        });
        //RSVP
      } else {
        this.get('model.' + type + 's').forEach((record) => {
          if (record.get('hasDirtyAttributes')) {
            didSave = true;
            record.save();
          }
        });
      }
      this.set('queuedSave', false);
      (didSave === true)? this.get('notify').success(`All ${type}s saved!`):'';
    },
    //Used to add and/or remove has-many relations from a record
    //eg if you wanted to change the tags relation of songs, you could use {{action "updateMany" "song" song "tag"}}
    updateMany(type, record, rel_type, rel_values){
      let updateSet = new Set(rel_values.mapBy('id')); //creates set based on new set of values
      let existingSet = new Set(record.get(rel_type + 's').mapBy('id'));//creates set based on existing set of values
      let addSet = new Set([...updateSet].filter(x => !existingSet.has(x))); //create addSet based on values that are in updateSet but not existingSet
      addSet.forEach((id) => { //add relationships from addSet
        let rel = this.get('store').peekRecord(rel_type, id);
        record.get(rel_type + 's').pushObject(rel);
        record.send('becomeDirty');
      });
      let removeSet = new Set([...existingSet].filter(x => !updateSet.has(x))); //create removeSet based on values that are in the existingSet but not in updateSet
      removeSet.forEach((id) => { //remove relationships from removeSet
        let rel = this.get('store').peekRecord(rel_type, id);
        record.get(rel_type + 's').removeObject(rel);
        record.send('becomeDirty');
      });
      this.send('autoSave', type);
    },
    //Used to change between exsisting has-one relations for a record
    //eg if you wanted to switch a book's editor from one value to another, you could use {{action "updateOne" "book" book "editor"}}
    updateOne(type, record, rel_type, rel_value){
      record.set(rel_type, rel_value);
      record.send('becomeDirty');
      this.send('autoSave', type);
    },
    //Use to upload a PDF with x-file-input
    //eg: {{x-file-input action=(action "uploadPDF" song) accept="application/pdf" class="btn btn-default"}}
    uploadPDF(record, file){
      this.set('isUploading', true); //disables submit until uploading is finished currently not implimented.  Re-add as feature to keep user from leaving the page
      let reader = new FileReader(); //instantiates the FileReader
      reader.onload = () => {
        record.set('pdf', reader.result); //puts the base64 data url into the model
        this.set('isUploading', false); //re-enables submitting
        record.save();
        Ember.$('#pdf-progress-' + record.id).addClass('file-upload-success').text(`File uploaded!`);
        Ember.run.later(this, function () {
          Ember.$('#pdf-progress-' + record.id).removeClass('save-flash').empty();
        }, 2500);
      };
      reader.onprogress = function (data) {
        if (data.lengthComputable) {
          let progress = parseInt(((data.loaded / data.total) * 100), 10);
          Ember.$('#pdf-progress-' + record.id).text(progress + '%'); //shows progress percentage when uploading
        }
      };
      reader.readAsDataURL(file[0]); //converts file to uploadable format
    },
    //Use to upload a Thumb with x-file-input
    //eg: {{x-file-input action=(action "uploadThumb" book) accept="image/png,image/jpg" class="btn btn-default" value="Upload"}}
    uploadThumb(record, file){
      this.set('isUploading', true); //disables submit until uploading is finished currently not implimented.  Re-add as feature to keep user from leaving the page
      let reader = new FileReader(); //instantiates the FileReader
      reader.onload = () => {
        record.set('thumb', reader.result); //puts the base64 data url into the model
        this.set('isUploading', false); //re-enables submitting
        record.save();
        Ember.$('#thumb-progress-' + record.id).addClass('file-upload-success').text(`File uploaded!`);
        Ember.run.later(this, function () {
          Ember.$('#thumb-progress-' + record.id).removeClass('save-flash').empty();
        }, 2500);
      };
      reader.onprogress = function (data) {
        if (data.lengthComputable) {
          let progress = parseInt(((data.loaded / data.total) * 100), 10);
          Ember.$('#thumb-progress-' + record.id).text(progress + '%'); //shows progress percentage when uploading
        }
      };
      reader.readAsDataURL(file[0]); //converts file to uploadable format
    }
  }
});
