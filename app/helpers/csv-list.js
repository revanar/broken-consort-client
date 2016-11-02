import Ember from 'ember';

export function csvList(params/*, hash*/) {
  let [model, type] = params;
  let result = "";
  model.get(type).forEach(function(res){
    result += Ember.String.htmlSafe(`<li>${Ember.Handlebars.Utils.escapeExpression(res.get("name"))}</li>`);
  });
  return new Ember.String.htmlSafe(`<ul class="csv">${result}</ul>`);
}

export default Ember.Helper.helper(csvList);
