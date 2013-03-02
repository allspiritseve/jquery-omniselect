# jQuery Omniselect

A lightweight and flexible autocomplete plugin that will work
with any backend, including Backbone and Ember.

## $(input).omniselect(options)

The omniselect function accepts an options object.

* `source` - Array of data or a callback
* `numResults` - Integer, maximum number of results to be displayed.
* `allowAdd` - Boolean, enables a separate result for selecting the currently selected text. When the result is selected, the `omniselect:add` event is fired.
* `resultsClass` - String containing one or more classes to be applied to the results list element, delimited by a space (E.g. "class-one class-two").
* `activeClass` - Sring containing one or more classes to be applied to the active result element, delimited by a space.
* `filter` - Takes a callback with two parameters `item` and `query`. Should return a truthy value if the item matches the query.
* `itemId` - Takes a callback with a single parameter `item`. Should return a unique identifier for that value in the array.
* `itemLabel` - Takes a callback wtih a single parameter `item`. Should return the label that is displayed in the list of results.
* `itemValue` - Takes a callback with a single parameter `item`. Should return the value that gets set on the input field when the item is selected.
* `renderItem` - Takes a callback with three parameters `label`, `id`, and `index`. Returns a string or element to be appended to the results list. In most cases you'll want this to be a `li` element. If you're specifying this callback, you should probably also specify `itemId` and/or `itemValue`.

You can also bind to the following events:

* `omniselect:select` - Takes a callback with two parameters `event` and `id`. If you want the input field to be cleared when an item is selected, do so here. If you return false, the item value will not be set on the input field.
* `omniselect:add` - Takes a callback with two parameters `event` and `value`. This gets fired when a value that is not in source has been selected.

## Array example

```javascript
$(document).ready(function() {
  var $search = $('#search');

  $search.omniselect({
    source: ['Uno', 'Dos', 'Tres', 'Cuatro'],
    numResults: 4
  });

  $search.on('omniselect:select', function(event, num) {
    console.log('Selected: ' + num);
  });
});
```

## Twitter Bootstrap example (Replaces Typeahead)

```javascript
$(document).ready(function() {
  var $input = $('#states');

  $input.omniselect({
    source: ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],
    resultsClass: 'typeahead dropdown-menu',
    activeClass: 'active',
    renderItem: function(label, id, index) {
      return '<li><a href="#">' + label + '</a></li>';
    }
  });
  
  $input.on('omniselect:select', function(event, value) {
    console.log('Selected: ' + value);
  });
});
```

```html
<div class="dropdown">
  <input type="text" name="search" class="span3" id="states" style="margin: 0" placeholder="Search here..." />
</div>
```


## Backbone example

```javascript
var artists = new TownStage.ArtistsCollection();
artists.fetch();

$(document).ready(function() {
  var $addArtist = $('#add_artist');

  $addArtist.omniselect({
    source: artists,
    allowAdd: true,
    id: function(artist) {
      return artist.get('id');
    },
    label: function(artist) {
      return artist.get('name');
    },
    filter: function(artist, query) {
      return artist.get('name').match(new RegExp(query.split('').join('.*'), 'i'));
    }
  });

  $addArtist.on('omniselect:select', function(event, id) {
    artist = artists.get(id);
    console.log('Added artist: ' + artist.get('name'));
  });

  $addArtist.on('omniselect:add', function(event, artist_name) {
    console.log('Create new artist: ' + artist_name);
  });

});
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
