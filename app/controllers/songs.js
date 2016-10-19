import Ember from 'ember';

export default Ember.Controller.extend({

  columns: [
    {
      propertyName:'book.name',
      title:'Title'
    },{
      propertyName:'book.editor.name',
      title:'Editor'
    },{
      propertyName:'book.year',
      title:'Year'
    },{
      propertyName:'song_no',
      title:'No.'
    },{
      propertyName:'name',
      title:'Name'
    }, {
      template: 'custom/languages',
      title: 'Text Language',
      propertyName: 'languages',
      disableSorting: true,
      filterFunction(cell, neededStr, obj){
        let result = obj.get('languages').filter(function(item){
          return item.get('name').toLowerCase().includes(neededStr);
        });
        return neededStr.length > 0 ? result.length > 0 : true;
      }
    },{
      template:'custom/tags',
      title:'Tags',
      propertyName:'tags',
      disableSorting: true,
      filterFunction(cell, neededStr, obj){
        let result = obj.get('tags').filter(function(item){
          return item.get('name').toLowerCase().includes(neededStr);
        });
        return neededStr.length > 0 ? result.length > 0 : true;
      }
    },{
      template:'custom/pdflink',
      title:'Download'
    }
  ],

  groupedHeaders: [
    [
      {
        title:'Book',
        colspan:3
      },{
        title:'Song',
        colspan:5
      }
    ]
  ]
});
