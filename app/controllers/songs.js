 import Ember from 'ember';

export default Ember.Controller.extend({
  //query parameters
  queryParams: ['sortBy', 'hidden', 'filter'],
  sortBy: '',
  hidden: '',
  isExpanded: false,
  filter: '',

  tableColumns:[
    {
      name: 'Title',
      value: 'title',
      model: 'book.name',
      modelType:'book',
      sortable: true,
      filterable: true
    },{
      name: 'Editor',
      value: 'editor',
      model: 'book.editor.name',
      modelType: 'book',
      sortable: true,
      filterable: true
    },{
      name: 'Year',
      value: 'year',
      model: 'book.year',
      modelType: 'book',
      sortable: true,
      filterable: true,
      type: 'number',
      min: '600',
      max: '1800',
      size: '4',
    },{
      name: 'Song No.',
      value: 'song-no',
      model: 'song_no',
      modelType: 'song',
      sortable: true,
      filterable: true,
      type: 'number',
      min: '1',
      max: '99',
      size: '2'
    },{
      name: 'Name',
      value: 'name',
      model: 'name',
      modelType: 'song',
      sortable: true,
      filterable: true
    },{
      name: 'Composer',
      value: 'composer',
      model: 'composer.name',
      modelType: 'song',
      sortable: true,
      filterable: true
    },{
      name: 'Parts No.',
      value: 'parts-no',
      model: 'parts_no',
      modelType: 'song',
      sortable: true,
      filterable: true,
      type: 'number',
      min: '1',
      max: '9',
      size: '1'
    },{
      name: 'Text Languages',
      value: 'languages',
      modelType: 'song',
      sortable: false,
      filterable: true
    },{
      name: 'Tags',
      value: 'tags',
      modelType: 'song',
      sortable: false,
      filterable: true
    },{
      name: 'Download',
      value: 'download',
      modelType: 'song',
      sortable: false,
      filterable: false
    }
  ],

  filterParams: Ember.computed('filter', function(){
    let params = this.get('filter').split(",");
    let paramObj = {};
    params.forEach((param)=>{
      let keyVal = param.split(":");
      paramObj[keyVal[0]] = keyVal[1];
    });
    return paramObj;
  }),
  visibleColumns: Ember.computed('hidden', 'tableColumns', function(){
    //a filtered version of tableColumns that only shows tableColumns that aren't hidden
    return this.get('tableColumns').filter((table)=>{
      let regExp = new RegExp(table.value, 'i');
      return !regExp.test(this.get('hidden'));
    });
  }),
  visibleBooks: Ember.computed('visibleColumns.@each.modelType', function(){
    return this.get('visibleColumns').filterBy('modelType', 'book');
  }),
  visibleSongs: Ember.computed('visibleColumns.@each.modelType', function(){
    return this.get('visibleColumns').filterBy('modelType', 'song');
  }),
  //filters model based on searchTerm value
  filteredModel: Ember.computed('model', 'filterParams', function(){
    let model = this.get('model').filterBy('pdf.pdf_path.url'); //removes all records that don't have a pdf uploaded
    let filterParams = this.get('filterParams');
    if (Object.keys(filterParams)[0].length > 0) for (var key in filterParams){
      let exp = filterParams[key];
      exp = exp.replace(/[{}"()]/g, ""); //removes any dubious characters from filter params
      let regExp = new RegExp(exp, 'i');
      model = model.filter(function(model) {
        let languages = (key === "all" || key === "languages") ?
          model.get('languages').filter(item => {return regExp.test(item.get('name'));}) : false;
        let tags = (key === "all" || key === "tags") ?
          model.get('tags').filter(item => {return regExp.test(item.get('name'));}) : false;
        return languages.length > 0 || tags.length > 0 ||
          ((key==="all" || key==="title") ? regExp.test(model.get('book').get('name')) : false) ||
          ((key==="all" || key==="editor") ? regExp.test(model.get('book').get('editor').get('name')) : false) ||
          ((key==="all" || key==="year") ? regExp.test(model.get('book').get('year')) : false) ||
          ((key==="all" || key==="song-no") ? regExp.test(model.get('song_no')): false) ||
          ((key==="all" || key==="name") ? regExp.test(model.get('name')) : false) ||
          ((key==="all" || key==="composer") ? regExp.test(model.get('composer').get('name')) : false) ||
          ((key==="all" || key==="parts-no") ? regExp.test(model.get('parts_no')) : false);
      });
    }
    return model;
  }),
  //this is the model after filters and sorting have been applied
  sortedSongs: Ember.computed.sort('filteredModel', 'sortDefinition').property('filteredModel', 'sortDefinition'),
  //when sortBy changes, ensures the model updates
  sortDefinition: Ember.computed('sortBy', function(){
    //for some reason, in Ember 2.10.0, an ember.computed.sort fails if the sort definition isn't
    //"a function or array of strings", so some value had to be given to it if no sortBy value is specified.
    //This pattern only exists to prevent said bug.
    if (this.get('sortBy')){
      return [this.get('sortBy'),'book.name','song_no'];
    } else {
      return ['book.name','song_no'];
    }
  }),
  noResults: Ember.computed('filteredModel', function(){
    return (this.get('filteredModel').length <= 0);
  }).property('filteredModel'),

  actions: {
    //function toggles whether or not the vlaue sent to it appears in the hidden queryParam
    toggleVisibility(value){
      //create a set from existing params
      let hidden = new Set(this.get('hidden').split(','));
      if (hidden.has(value)){
        hidden.delete(value);
      } else {
        hidden.add(value);
      }
      let hiddenStr = '';
      hidden.forEach((item)=>{
        hiddenStr += item+','
      });
      hiddenStr = hiddenStr.slice(0,-1);
      //slice off the final comma
      this.set('hidden', hiddenStr);
    },
    togglePanel(){
      this.toggleProperty('isExpanded');
    },
    updateParam(param, value, key){
      if (value) param[key] = value; else delete param[key];
      let str = JSON.stringify(param);
      str = str.replace(/[{}"]/g, "");
      this.set('filter', str);
    },
    resetParams(){
      //note:  This is needed because filterParams are really sticky otherwise!
      Ember.$('.song-filter').val('');
      this.set('filterParams', '');
    }
  }
});
