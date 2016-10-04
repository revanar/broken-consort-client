import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  song_no: DS.attr(),
  parts_no: DS.attr(),
  has_text: DS.attr(),
  is_transcribed: DS.attr(),
  pdf_path: DS.attr(),

  composer: DS.belongsTo('composer'),
  book: DS.belongsTo('book'),
  tags: DS.hasMany('tag')
});
