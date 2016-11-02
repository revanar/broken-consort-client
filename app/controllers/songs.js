import Ember from 'ember';

export default Ember.Controller.extend({
  init(){
    this._super(...arguments);
    Ember.run.schedule("afterRender",this,function() {
      //after page is rendered, add glyphicons based on sort order
      //translates from model syntax to id syntax
      let qp = ((!!this.get('sortBy')) ? this.get('sortBy').replace(/./g,'-') : '');
      if (qp.includes(':asc')){
        let q = qp.slice(0,-4);
        Ember.$('#'+q).append('<span class="glyphicon glyphicon-triangle-bottom"> </span>');
      } else if (qp.includes(':desc')){
        let q = qp.slice(0,-5);
        Ember.$('#'+q).append('<span class="glyphicon glyphicon-triangle-top"> </span>');
      }
    });
  },
  //query parameters
  queryParams: ['sortBy', 'searchTerm'],
  sortBy: '',
  searchTerm: '',
  //when searchTerm changes, ensures the model updates
  searchTermChanged: Ember.observer('searchTerm', function(){
    //looks to see if search term contains only letters, numbers, and spaces
    let _this = this;
    let regExp = new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');
    if (!regExp.test(this.get('searchTerm'))) {
      //if illegal characters are detected, prevents them from appearing in queryparams
      this.set('searchTerm', this.get('searchTerm').slice(0, -1));
    } else {
      //otherwise, notify the model that its filter has been updated
      Ember.run.schedule("afterRender", this, function () {
        _this.get('filteredModel').notifyPropertyChange('searchTerm');
      });
    }
  }),
  //filters model based on searchTerm value
  filteredModel: Ember.computed('model', 'searchTerm', function(){
    let model = this.get('model').filterBy('pdf.pdf_path.url'); //removes all records that don't have a pdf uploaded
    let regExp = new RegExp(this.get('searchTerm'), 'i');
    return model.filter(function(model){
      let langRes = model.get('languages').filter(item => {return regExp.test(item.get('name'));});
      let tagRes = model.get('tags').filter(item => {return regExp.test(item.get('name'));});
      return langRes.length > 0 ||
        tagRes.length > 0 ||
        regExp.test(model.get('name')) ||
        regExp.test(model.get('song_no')) ||
        regExp.test(model.get('book').get('name')) ||
        regExp.test(model.get('book').get('editor').get('name')) ||
        regExp.test(model.get('book').get('year'));
    });
  }).property('searchTerm'),
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
      Ember.$('.list-sortable').find('span').remove();
      if (this.get('sortBy') === value + ':asc') {
        //if currently sorted asc, change to desc
        this.set('sortBy', value + ':desc');
        Ember.$(event.target).append('<span class="glyphicon glyphicon-triangle-top"> </span>');
      } else if (this.get('sortBy') === value + ':desc') {
        //if currently sorted desc, change to null
        this.set('sortBy', '');
      } else {
        //otherwise, change to asc
        this.set('sortBy', value + ':asc');
        Ember.$(event.target).append('<span class="glyphicon glyphicon-triangle-bottom"> </span>');
      }
    }
  }
});
