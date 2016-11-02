import { test } from 'qunit';
import moduleForAcceptance from 'client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | app');

//tests for /songs
test('should redirect to songs route', function(assert){
  visit('/');
  andThen(function(){
    assert.equal(currentURL(), '/songs', 'should redirect automatically');
  });
});

test('should list all transcribed songs', function(assert){
  visit('/');
  andThen(function () {
    assert.equal(find('.listing').length, 5, 'should see 5 listings');
  });
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

test('should show books in alpabetical order, followed by songs in alphabetical order', function(assert){
  visit('/');
  andThen(function(){
    assert.equal(find('.listing > td').first().text().trim(), "First Book of Songs");
    assert.equal(find('.listing').last().find('td').first().text().trim(), "Pavans Galliards Almains");
  });
});


// additional tests to add:
//   checking that each different type of filter works on songs
//   potentially adding details pages to books/collections
//   adding a lightbox component to add/edit tags
