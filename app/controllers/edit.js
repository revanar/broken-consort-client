import Ember from 'ember';

export default Ember.Controller.extend({
  notify: Ember.inject.service('notify'),
  isUploading: false,
  modalClasses: ['modal-save-flash'],
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
    createOne(type, record, rel_type, rel_value){ //should look like {{action createOne "book" book "editor"}}. rel_value is provided by helper
      this.get('store').createRecord(rel_type, {
        name: rel_value
      }).save().then((result) => {
        record.set(rel_type, result);
        record.send('becomeDirty');
        this.send('autoSave', type);
      });
    },
    createRecord(type){
      this.get('store').createRecord(type).save();
    },
    deleteRecord(record){
      record.destroyRecord();
    },
    save(record){
      record.save();

    },
    saveAll(type){
      //non-RSVP
      if (this.get('model.' + type + 's') === undefined) {
        this.get('model').forEach((record) => {
          if (record.get('hasDirtyAttributes')) {
            record.save();
          }
        });
        //RSVP
      } else {
        this.get('model.' + type + 's').forEach((record) => {
          if (record.get('hasDirtyAttributes')) {
            record.save();
          }
        });
      }
      this.set('queuedSave', false);
      this.get('notify').success(`All ${type}s saved!`);
    },
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
    updateOne(type, record, rel_type, rel_value){
      record.set(rel_type, rel_value);
      record.send('becomeDirty');
      this.send('autoSave', type);
    },
    uploadPDF(record, file){
      this.set('isUploading', true); //disables submit until uploading is finished currently not implimented.  Re-add as feature to keep user from leaving the page
      let reader = new FileReader(); //instantiates the FileReader

      reader.onload = () => {
        record.set('pdf', reader.result); //puts the base64 data url into the model
        this.set('isUploading', false); //re-enables submitting
        this.send('save', record);
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
    uploadThumb(record, file){
      this.set('isUploading', true); //disables submit until uploading is finished currently not implimented.  Re-add as feature to keep user from leaving the page
      let reader = new FileReader(); //instantiates the FileReader

      reader.onload = () => {
        record.set('thumb', reader.result); //puts the base64 data url into the model
        this.set('isUploading', false); //re-enables submitting
        this.send('save', record);
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
