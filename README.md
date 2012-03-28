# jQuery Multiselect

A lightweight and flexible autocomplete plugin that will work
with any backend, including Backbone.js.

## $(input).multiselect(options)

The multiselect function accepts an options object.

* `source`        - Array of data
* `get`           - Takes a callback with a single parameter `id` and returns the item from the array that matches that id
* `id`            - Takes a callback with a single parameter `value` and returns the id for that value in the array
* `label`         - Takes a callback wtih a single parameter `value` and returns the label that will be shown in the dropdown when an item matches the query
* `filter`        - Takes a callback with two parameters `value` and `query`, and returns the value if it matches the query.
* `select`        - Takes a callback with a single parameter `value`.

## Backbone Example

```
artists = new TownStage.ArtistsCollection()
artists.fetch()

$(document).ready ->
  $('#add_artist').multiselect
    source: -> artists
    get: (id) -> artists.get(id)
    id: (artist) -> artist.get('id')
    label: (artist) -> artist.get('name')
    filter: (artist,query) ->
      artist if artist.get('name').match new RegExp(query.split('').join('.*'), 'i')
    select: (artist) -> console.log(artist.get('name'))
```
