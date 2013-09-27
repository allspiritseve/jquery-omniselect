!function($, window) {
  var omniselect = function(spec) {
    var plugin = {}, data = {};
    
    var defaults = {
      cycle: false,
      source: [],
      resultsClass: 'omniselect-results',
      activeClass: 'omniselect-active',
      searchDelay: 300,
      numResults: 5
    };

    var keys = {
      tab: 9,
      enter: 13,
      shift: 16,
      control: 17,
      alt: 18,
      escape: 27,
      up: 38,
      down: 40
    }

    var $input = $(spec.input),
      options = $.extend({}, defaults, spec.options),
      visible = false, searching,
      $results = $('<ul></ul>', { class: options.resultsClass }),
      activeClassSelector = '.' + options.activeClass.split(' ').join('.'),
      resultsClassSelector = '.' + options.resultsClass.split(' ').join('.');

    plugin.init = function() {
      $input.on('focus.omniselect', plugin.bind)
        .on('blur.omniselect', plugin.blur);
      return plugin;
    };

    plugin.bind = function() {
      $input.on('keyup.omniselect', plugin.keyup)
        .on('keydown.omniselect', plugin.keydown);
      return plugin;
    };

    plugin.unbind = function() {
      $input.off('.omniselect');
      return plugin;
    };

    plugin.show = function() {
      visible = true;
      $results.insertAfter($input).show();
    };

    plugin.hide = function() {
      visible = false;
      $results.off().hide();
      fire('omniselect:hide');
    };

    plugin.renderItem = options.renderItem || function(item, index) {
      return '<li class="' + itemClass(item, index) + '" data-omniselect-index="' + index + '"><a>' + itemLabel(item, index) + '</a></li>';
    };

    plugin.renderAddItem = options.renderAddItem || function(query) {
      return '<li class="" data-omniselect-add="true"><a>' + query + '</a></li>';
    };

    plugin.keydown = function(e) {
      switch(e.keyCode) {
        case keys.tab:
        case keys.enter:
        case keys.escape:
          e.preventDefault();
          return;
      }
    };

    plugin.keyup = function(e) {
      var results, query, lastQuery;
      if (e.data) { results = e.data.results }
      switch (e.keyCode) {
        case keys.shift:
        case keys.control:
        case keys.alt:
          return;
        case keys.up:
          if (results) { results.previous() }
        case keys.down:
          if (results) { results.next() }
        case keys.escape:
          if (visible) { plugin.hide() }
          return;
        case keys.tab:
        case keys.enter:
          if (results) { select(results.selectedItem()) }
          return;
      }
      if (results) { lastQuery = results.query() }
      query = $input.val();
      if (query != '' && query != lastQuery) { search(query) }
    };

    var mouseenter = function(e) {
      var index = $(e.currentTarget).data('omniselect-index'), results = e.data.results;
      results.selectItemAt(index);
    };

    var click = function(e) {
      var $item = $(e.currentTarget), results = e.data.results;
      if ($item.data('omniselect-add-item')) {
        add(results.query());
      } else {
        var index = $item.data('omniselect-index');
        results.selectItemAt(index);
        item = results.selectedItem();
        select(item);
      }
      return false;
    };

    var select = function(item) {
      console.log('Select', item);
      if (fire('omniselect:select', item)) { plugin.hide() }
    }

    var add = function(query) {
      if (fire('omniselect:add', query)) { plugin.hide() }
    }

    var findItemIndex = function(id) {
      var itemIndex;
      results.forEach(function(item, index) {
        if (itemId(item, index) == id) {
          itemIndex = index;
        }
      });
      return itemIndex;
    }

    var itemClass = function(item, index) {
      return index === currentItemIndex ? options.activeClass : ''
    };

    var itemId = function(item, index) {
      return item;
    };

    var itemLabel = function(item, index) {
      return item;
    };

    var search = function(query) {
      if (query == '') { plugin.hide() };
      if (searching) { clearTimeout(searching) };
      var callback = function(items) {
        render(results({ query: query, items: items }));
      }
      if ($.isFunction(options.source)) {
        searching = setTimeout(function() {
          options.source(query, callback);
        }, options.searchDelay);
      } else {
        callback(options.source);
      }
    };

    var results = function(spec) {
      var index = 0, query = spec.query, items = spec.items;
      return {
        query: function() { return query },
        selectItemAt: function(newIndex) { index = newIndex },
        selectedItemIndex: function() { return index },
        selectedItem: function() { return items[index] },
        setItems: function(newItems) { items = newItems },
        items: function() { return items },
        previous: function() {
          if (index > 0) {
            index -= 1;
          } else if (options.cycle) {
            index = items.length - 1;
          }
        },
        next: function() {
          if (index < items.length - 1) {
            index += 1;
          } else if (options.cycle) {
            index = 0;
          }
        },
      }
    };

    var render = function(results) {
      $results.data('query', results.query());
      unbindResults();
      $results.html(renderResults(results));
      bindResults(results);
      plugin.show();
    };

    var bindResults = function(results) {
      $input.on('keyup.omniselectResults', { results: results }, plugin.keyup);
      $results.on('mouseenter.omniselectResults', 'li', { results: results }, mouseenter);
      $results.on('click.omniselectResults', 'li', { results: results }, click);
    }

    var unbindResults = function() {
      $input.off('.omniselectResults');
      $results.off('.omniselectResults');
    }

    var renderResults = function(results) {
      var items = results.items(), renderedItems = [], query = results.query();
      items.forEach(function(item, index) {
        var $renderedItem = $(plugin.renderItem(item, index));
        $renderedItem.data('omniselect-index', index);
        renderedItems.push($renderedItem);
      });
      if (options.allowAdd) {
        var $renderedItem = $(plugin.renderAddItem(results.query));
        $renderedItem.data('omniselect-add-item', true);
        renderedItems.push($renderedItem);
      }
      return renderedItems;
    };

    var fire = function(name, data) {
      var event = $.Event(name);
      $input.trigger(event, data);
      return event.result !== false;
    };

    return plugin.init();
  };
  window.omniselect = omniselect;

  $.fn.omniselect = function(options) {
    return this.each(function() {
      omniselect({ input: this, options: options });
    });
  };

}(jQuery, window);
