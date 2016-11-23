 import Ember from 'ember';

export default Ember.Controller.extend({
  //query parameters
  queryParams: ['sortBy', 'hidden', 'q_all','q_title','q_creator','q_editor','q_song_no','q_book_title','q_year','q_languages','q_tags'],
  sortBy: '',
  hidden: '',
  q_all: '',
  q_title: '',
  q_creator: '',
  q_editor: '',
  q_song_no: '',
  q_book_title: '',
  q_year: '',
  q_languages: '',
  q_tags: '',

  tableColumns:[
    {
      name: 'Title',
      value: 'title',
      model: 'book.name',
      type:'book',
      sortable: true
    },{
      name: 'Editor',
      value: 'editor',
      model: 'book.editor.name',
      type: 'book',
      sortable: true
    },{
      name: 'Year',
      value: 'year',
      model: 'book.year',
      type: 'book',
      sortable: true
    },{
      name: 'Song No.',
      value: 'song-no',
      model: 'song_no',
      type: 'song',
      sortable: true
    },{
      name: 'Name',
      value: 'name',
      model: 'name',
      type: 'song',
      sortable: true
    },{
      name: 'Text Languages',
      value: 'languages',
      type: 'song',
      sortable: false
    },{
      name: 'Tags',
      value: 'tags',
      type: 'song',
      sortable: false
    },{
      name: 'Download',
      value: 'download',
      type: 'song',
      sortable: false
    }
  ],
  visibleColumns: Ember.computed('hidden', 'tableColumns', function(){
    let visibleColumns = this.get('tableColumns').filter((table)=>{
      let regExp = new RegExp(table.value, 'i');
      return !regExp.test(this.get('hidden'));
    });
    return visibleColumns;
  }),
  hiddenColumns: Ember.computed('hidden', 'tableColumns', function(){
    let hiddenColumns = this.get('tableColumns').filter((table)=>{
      let regExp = new RegExp(table.value, 'i');
      return regExp.test(this.get('hidden'));
    });
    return hiddenColumns;
  }),
  visibleBooks: Ember.computed('visibleColumns.@each.type', function(){
    return this.get('visibleColumns').filterBy('type', 'book');
  }),
  visibleSongs: Ember.computed('visibleColumns.@each.type', function(){
    return this.get('visibleColumns').filterBy('type', 'song');
  }),
  //filters model based on searchTerm value
  filteredModel: Ember.computed('model', 'q_all', 'q_title', 'q_song_no', 'q_editor', 'q_creator', 'q_book_title', 'q_year', 'q_languages', 'q_tags', function(){
    let model = this.get('model').filterBy('pdf.pdf_path.url'); //removes all records that don't have a pdf uploaded
    this.get('queryParams').forEach((filter)=> { // for each possible filter
      if ((filter !== 'sortBy') && (filter !== 'hidden') && (this.get(filter).length > 0)) { //if the filter has content and isn't the sortBy queryparam
        //guardian pattern to prevent invalid inputs
        let valid = new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');
        while (this.get(filter).length > 0 && !valid.test(this.get(filter))){
          this.set(filter, this.get(filter).slice(0,-1));
        }
        //filtering bit
        let regExp = new RegExp(this.get(filter), 'i'); //filter model on fields based on what the filter name is
        model = model.filter(function (model) {
          //filters for hasMany relationships
          let languages = (filter === "q_all" || filter === "q_languages") ?
            model.get('languages').filter(item => {return regExp.test(item.get('name'));}) : false;
          let tags = (filter === "q_all" || filter === "q_tags") ?
            model.get('tags').filter(item => {return regExp.test(item.get('name'));}) : false;
          //returns true for any data items that need to be kept
          return languages.length > 0 || tags.length > 0 ||
            ((filter === "q_all" || filter === "q_title") ? regExp.test(model.get('name')) : false) ||
            ((filter === "q_all" || filter === "q_song_no") ? regExp.test(model.get('song_no')) : false) ||
            ((filter === "q_all" || filter === "q_editor") ? regExp.test(model.get('book').get('editor').get('name')) : false) ||
            ((filter === "q_all" || filter === "q_creator") ? regExp.test(model.get('composer').get('name')) : false) ||
            ((filter === "q_all" || filter === "q_book_title") ? regExp.test(model.get('book').get('name')) : false) ||
            ((filter === "q_all" || filter === "q_year") ? regExp.test(model.get('book').get('year')) : false);
        });
      }
    });
    return model;
  }),
  //this is the model after filters and sorting have been applied
  sortedSongs: Ember.computed.sort('filteredModel', 'sortDefinition').property('filteredModel', 'sortDefinition'),
  //when sortBy changes, ensures the model updates
  sortDefinition: Ember.computed('sortBy', function(){
    return [this.get('sortBy')];
  }),
  noResults: Ember.computed('filteredModel', function(){
    return (this.get('filteredModel').length <= 0);
  }).property('filteredModel'),

  actions: {
    hideColumns(params){
      let hidden = '';
      params.forEach((param)=>{
        hidden += param.value+',';
      });
      this.set('hidden', hidden);
    }
  }
});
