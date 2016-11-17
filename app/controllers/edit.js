import Ember from 'ember';

export default Ember.Controller.extend({
  notify: Ember.inject.service('notify'),
  isUploading: false,
  textTest: [],
  actions: {
    // Will call a saveAll action once after a 3-second delay.
    // Helps throttle number of saveAll requests made when making multiple changes in a short period of time
    //eg to save all songs, use {{action "autoSave" "song"}}
    autoSave(type){
      let isUploading = (Ember.$('.file-uploading').length); //don't trigger autosave on file uploads, since those save separately
      if (!this.get('queuedSave') && !isUploading) {
        this.get('notify').warning(`Saving all ${type}s...`);
        Ember.run.later(this, function () { //auto-saves data 5 seconds after an auto-save request is recieved
          this.send('saveAll', type);
        }, 3000);
        this.set('queuedSave', true); //if an autosave is already queued, don't bother queueing another one.
      }
    },
    //use to create a has-many relationship item
    //eg if you have a book and want to create a song for it, you could use {{action "createMany" "book" book "song"}}
    createMany(record, rel_type, select, key){
      let type = record.constructor.modelName;
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
    createOne(record, rel_type, rel_value){
      let type = record.constructor.modelName;
      this.get('store').createRecord(rel_type, {
        name: rel_value
      }).save().then((result) => {
        record.set(rel_type, result);
        record.send('becomeDirty');
        this.send('autoSave', type);
      });
    },
    //use for deleting an existing record
    //eg if you want to delete a song, you could use {{action "deleteRecord" song}}
    deleteRecord(record){
      record.destroyRecord();
    },
    //Immediately saves any modified records of the specified type to the server
    //eg if you want to save all songs, you could use {{action "saveAll" "song"}}
    saveAll(type){
      console.log('saving all' + type);
      let didSave = false;
      //non-RSVP
      if (this.get('model.' + type + 's') === undefined) {
        this.get('model').forEach((record) => {
          if (record.get('isDirty')) {
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
      if(didSave === true){
        this.get('notify').success(`All ${type}s saved!`);
      }
    },
    //Used to add and/or remove has-many relations from a record
    //eg if you wanted to change the tags relation of songs, you could use {{action "updateMany" "song" song "tag"}}
    //note: CHANGED TO UPDATE FROM RELATION INSTEAD OF FROM RECORD. THIS WORKS AND I DON'T KNOW WHY
    updateMany(record, rel_type, rel_values){
      let updateSet = new Set(rel_values.mapBy('id')); //creates set based on new set of values
      let existingSet = new Set(record.get(rel_type + 's').mapBy('id'));//creates set based on existing set of values
      let addSet = new Set([...updateSet].filter(x => !existingSet.has(x))); //create addSet based on values that are in updateSet but not existingSet
      addSet.forEach((id) => { //add relationships from addSet
        let rel = this.get('store').peekRecord(rel_type, id);
        record.get(rel_type + 's').pushObject(rel);
        rel.send('becomeDirty');
      });
      let removeSet = new Set([...existingSet].filter(x => !updateSet.has(x))); //create removeSet based on values that are in the existingSet but not in updateSet
      removeSet.forEach((id) => { //remove relationships from removeSet
        let rel = this.get('store').peekRecord(rel_type, id);
        record.get(rel_type + 's').removeObject(rel);
        rel.send('becomeDirty');
      });
      this.send('autoSave', rel_type);
    },
    //Used to change between exsisting has-one relations for a record
    //eg if you wanted to switch a book's editor from one value to another, you could use {{action "updateOne" "book" book "editor"}}
    updateOne(record, rel_type, rel_value){
      let type = record.constructor.modelName;
      record.set(rel_type, rel_value);
      record.send('becomeDirty');
      this.send('autoSave', type);
    }
  }
});
