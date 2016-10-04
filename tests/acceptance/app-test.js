import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | app');

test('should redirect to songs route', function(assert){
  visit('/');
  andThen(function(){
    assert.equal(currentURL(), '/songs', 'should redirect automatically');
  });
});

test('should list all transcribed songs', function(assert){
  visit('/');
  assert.equal(find('.listing').length, 3, 'should see 3 listings');
});

test('should link to list of books', function(assert){
  visit('/');
  click('a:contains("Books")');
  andThen(function(){
    assert.equal(currentURL(), '/books', 'should navigate to books');
  });
});

test('should link to list of collections', function(assert){
  visit('/');
  click('a:contains("Collections")');
  andThen(function(){
    assert.equal(currentURL(), '/collections', 'should navigate to colletions');
  });
});

test('should link to information about project', function(assert){
  visit('/');
  click('a:contains("About")');
  andThen(function(){
    assert.equal(currentURL(), '/about', 'should navigate to about');
  });
});

// additional tests to add:
//   checking that each different type of filter works on songs
//   potentially adding details pages to books/collections
//   adding a lightbox component to add/edit tags
