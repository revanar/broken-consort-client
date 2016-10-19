import Ember from 'ember';

export default Ember.Controller.extend({
  isUploading: false,
  actions: {
    createEditor(book, editor){
      this.get('store').createRecord('editor', {
        name: editor
      }).save().then(function(result){
        book.set('editor', result);
        //note: removed book.save(); so that all saving can be done with update action.
      });
    },
    update(book){
      book.save();
      $('*[id^=pdf-progress-]').empty(); //clears any pdf loading percentages for cosmetic reasons
    },
    uploadPDF(book, file){
      let toggle = this; //pushes 'this' into a variable so I can use it in a function
      toggle.set('isUploading', true); //disables submit until uploading is finished
      let reader = new FileReader(); //instantiates the FileReader

      reader.onload = function(e){
        book.set('pdf', reader.result); //puts the base64 data url into the model
        toggle.set('isUploading', false); //re-enables submitting
      };

      reader.onprogress = function(data){
        if (data.lengthComputable){
          let progress = parseInt(((data.loaded/data.total)*100),10);
          $('#pdf-progress-'+book.id).text(progress+'%'); //shows progress percentage when uploading
        }
      };
      reader.readAsDataURL(file[0]); //converts file to uploadable format
    }
  }
});
