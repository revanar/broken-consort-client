import Ember from 'ember';

export default Ember.Controller.extend({
  columns: [
    {
      propertyName:'name',
      title:'Title'
    },{
      propertyName:'editor.name',
      title:'Editor'
    },{
      propertyName:'year',
      title:'Year'
    },{
      template:'custom/pdflink',
      title:'Download'
    }
  ]
});
