import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('songs');
  this.route('songs.edit', {path: '/songs/edit'});
  this.route('books');
  this.route('books.edit', {path: '/books/edit'});
  this.route('collections');
  this.route('collections.edit', {path: '/collections/edit'});
  this.route('languages.edit', {path: 'languages/edit'});
  this.route('tags.edit', {path: 'tags/edit'});
});

export default Router;
