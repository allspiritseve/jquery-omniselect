jQuery Multiselect is a lightweight autocomplete plugin that will work
with any backend, including Backbone.js.

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
