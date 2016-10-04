import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  abbr: DS.attr(),
  desc: DS.attr(),
  color: DS.attr(),

  songs: DS.hasMany('song')
});
