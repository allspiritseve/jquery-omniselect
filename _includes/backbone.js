artists = new ArtistCollection();
artists.fetch();
$(document).ready(function() {
  $('#new_artist').omnicomplete({
    source: function() {
      return artists;
    },
    get: function(id) {
      return artists.get('id');
    },
    id: function(artist) {
      return artist.get('id');
    },
    label: function(artist) {
      return artist.get('name');
    },
    filter: function(artist, query) {
      if (artist.get('name').match(new RegExp(query.split('').join('.*'), 'i'))) { // Case insensitive fuzzy matching
        return artist;
      }
    },
    select: function(artist) {
      console.log('Selected artist: ' + artist.get('name'));
    }
  });
});
