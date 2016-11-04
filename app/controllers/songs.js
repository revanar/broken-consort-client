 import Ember from 'ember';

export default Ember.Controller.extend({
  init(){
    this._super(...arguments);
    Ember.run.schedule("afterRender",this,function() {
      //after page is rendered, add glyphicons based on sort order
      //translates from model syntax to id syntax
      let qp = ((!!this.get('sortBy')) ? this.get('sortBy').replace(/\./g,'-') : '');
      if (qp.includes(':asc')){
        let q = qp.slice(0,-4);
        Ember.$('#'+q).addClass('sort-asc');
      } else if (qp.includes(':desc')){
        let q = qp.slice(0,-5);
        Ember.$('#'+q).addClass('sort-desc');
      }
    });
  },
  //query parameters
  queryParams: ['sortBy', 'q_all','q_title','q_creator','q_editor','q_song_no','q_book_title','q_year','q_languages','q_tags'],
  sortBy: '',
  filters: ['q_all','q_title','q_creator','q_editor','q_song_no','q_book_title','q_year','q_languages','q_tags'],
  q_all: '',
  q_title: '',
  q_creator: '',
  q_editor: '',
  q_song_no: '',
  q_book_title: '',
  q_year: '',
  q_languages: '',
  q_tags: '',
  //filters model based on searchTerm value
  filteredModel: Ember.computed('model', 'q_all', 'q_title', 'q_song_no', 'q_editor', 'q_creator', 'q_book_title', 'q_year', 'q_languages', 'q_tags', function(){
    let model = this.get('model').filterBy('pdf.pdf_path.url'); //removes all records that don't have a pdf uploaded
    this.get('filters').forEach((filter)=> { // for each possible filter
      if (this.get(filter).length > 0) { //if the filter has content
        //guardian pattern to prevent invalid inputs
        let valid = new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');
        while (!valid.test(this.get(filter))){
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
    //add validation to check that sortby is a sortable value.  If yes,
    return [this.get('sortBy')];
    //if no, this.set('sortBy','');
  }),
  actions: {
    //action that occurs when you click on a sortable column header
    setSortBy(val){
      //translates between id syntax and model syntax
      //note: val is passed from list-sortable component
      let value = val.replace(/-/g, '.');
      Ember.$('.list-sortable').removeClass('sort-asc sort-desc');
      if (this.get('sortBy') === value + ':asc') {
        //if currently sorted asc, change to desc
        this.set('sortBy', value + ':desc');
        Ember.$(event.target).addClass('sort-desc');
      } else if (this.get('sortBy') === value + ':desc') {
        //if currently sorted desc, change to null
        this.set('sortBy', '');
      } else {
        //otherwise, change to asc
        this.set('sortBy', value + ':asc');
        Ember.$(event.target).addClass('sort-asc');
      }
    }
  }
});
