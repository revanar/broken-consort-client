import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  abbr: DS.attr(),
  year: DS.attr(),
  thumb_path: DS.attr,
  pdf_path: DS.attr,

  songs: DS.hasMany('song'),
  editor: DS.belongsTo('editor')
});
