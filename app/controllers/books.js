import Ember from 'ember';

export default Ember.Controller.extend({
  columns: [
    {
      template:'custom/pdfthumb',
      title:'Download',
      className: 'pdfthumb'
    },{
      propertyName:'name',
      title:'Title'
    },{
      propertyName:'editor.name',
      title:'Editor'
    },{
      propertyName:'year',
      title:'Year'
    }
  ]
});
