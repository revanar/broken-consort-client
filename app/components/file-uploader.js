import Ember from 'ember';

export default Ember.Component.extend({
  //{{file-uploader model=book type="pdf" action=(action "uploadPDF" book)}}
  //type is optional, defaults to pdf
  type: 'pdf',
  acceptTypes: Ember.computed('type', function(){
    if (this.get('type') === 'pdf'){
      return 'application/pdf'
    } else if (this.get('type') === 'thumb'){
      return 'image/png,image/jpg'
    }
  }),
  actions: {
    uploadPDF(record, file){
      Ember.$('#pdf-progress-' + record.id).addClass('file-uploading');
      let reader = new FileReader(); //instantiates the FileReader
      reader.onload = () => {
        record.set('pdf', reader.result); //puts the base64 data url into the model
        record.save();
        Ember.$('#pdf-progress-' + record.id).addClass('file-upload-success').text(`File uploaded!`);
        Ember.run.later(this, function () {
          Ember.$('#pdf-progress-' + record.id).removeClass('file-upload-success file-uploading').empty();
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
      Ember.$('#thumb-progress-' + record.id).addClass('file-uploading');
      let reader = new FileReader(); //instantiates the FileReader
      reader.onload = () => {
        record.set('thumb', reader.result); //puts the base64 data url into the model
        record.save();
        Ember.$('#thumb-progress-' + record.id).addClass('file-upload-success').text(`File uploaded!`);
        Ember.run.later(this, function () {
          Ember.$('#thumb-progress-' + record.id).removeClass('file-upload-success file-uploading').empty();
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
