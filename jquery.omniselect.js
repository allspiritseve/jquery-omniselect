!function($, window) {
  var omniselect = function(spec) {
    var plugin = {};
    
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
      results = [], visible = false, focused, searching, mouseover,
      $results = $('<ul></ul>', { class: options.resultsClass }),
      currentItemIndex = 0, value, currentQuery,
      activeClassSelector = '.' + options.activeClass.split(' ').join('.'),
      suppressKeyPressRepeat;

    plugin.init = function() {
      $input.on('focus.omniselect', plugin.focus).on('blur.omniselect', plugin.blur);
      return plugin;
    };

    plugin.focus = function() {
      focused = true;
      $input.on('keyup.omniselect', plugin.keyup)
        .on('keydown.omniselect', plugin.keydown);
      $results.on('click.omniselect', plugin.click)
        .on('mouseenter.omniselect', 'li', plugin.mouseenter)
        .on('mouseleave.omniselect', 'li', plugin.mouseleave);
      return plugin;
    };

    plugin.blur = function() {
      focused = false;
      $input.off('keydown.omniselect')
        .off('keyup.omniselect');
      $results.off('click.omniselect')
        .off('mouseenter.omniselect', 'li')
        .off('mouseleave.omniselect', 'li');
      return plugin;
    };

    plugin.show = function() {
      visible = true;
      $results.insertAfter($input).show();
      return plugin;
    };

    plugin.hide = function() {
      visible = false;
      $results.hide()
      return plugin;
    };

    plugin.search = function(query) {
      console.log('Search', query);
      if (searching) { clearTimeout(searching) };
      searching = setTimeout(function() { search(query) }, options.searchDelay);
    }

    plugin.results = function(items) {
      if ($.isFunction(options.filter)) {
        items = items.filter(function(item) {
          return options.filter(item, currentQuery);
        });
      }

      if (options.numResults) {
        items = items.slice(0, options.numResults - 1);
      }

      plugin.renderItems(items);

      plugin.setCurrentItemIndex(0);

      results = items;

      plugin.show();
    };

    plugin.renderItems = function(items) {
      $results.html(items.map(plugin.renderItem));
    };

    plugin.renderItem = function(item, index) {
      return '<li class="' + itemClass(item, index) + '" data-omniselect-index="' + index + '"><a>' + itemLabel(item, index) + '</a></li>';
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

      var keyup = function(e) {
        var query = $input.val();
        if (query != lastQuery) {
          console.log('New query', query);
          dropdown.search(query);
          lastQuery = query;
        }
      };

    plugin.keyup = function(e) {
      switch (e.keyCode) {
        case keys.shift:
        case keys.control:
        case keys.alt:
          return;
        case keys.up:
          return plugin.previous();
        case keys.down:
          return plugin.next();
        case keys.tab:
        case keys.enter:
          if (visible) { plugin.select() }
          return;
        case keys.escape:
          if (visible) { plugin.hide() }
          return;
      }
      plugin.search($input.val());
    };

    plugin.click = function() {
      plugin.select();
      return false;
    };

    plugin.mouseenter = function(e) {
      mouseover = true;
      var index = $(e.currentTarget).data('omniselect-index')
      plugin.setCurrentItemIndex(index);
    };

    plugin.mouseleave = function(e) {
      mouseover = false;
      if (focused && visible) { plugin.hide() }
    }

    plugin.setCurrentItemIndex = function(index) {
      $results.children('[data-omniselect-index="' + currentItemIndex + '"]').removeClass(options.activeClass);
      currentItemIndex = index;
      $results.children('[data-omniselect-index="' + index + '"]').addClass(options.activeClass);
    }

    plugin.previous = function() {
      if (currentItemIndex > 0) {
        plugin.setCurrentItemIndex(currentItemIndex - 1);
      } else if (options.cycle) {
        plugin.setCurrentItemIndex(results.length - 1);
      }
    }

    plugin.next = function() {
      if (currentItemIndex < results.length - 1) {
        plugin.setCurrentItemIndex(currentItemIndex + 1);
      } else if (options.cycle) {
        plugin.setCurrentItemIndex(0);
      }
    }

    plugin.currentItem = function() {
      return results[currentItemIndex];
    };

    plugin.select = function() {
      fire('omniselect:select', plugin.currentItem());
      plugin.hide();
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
      currentQuery = query;
      if ($.isFunction(options.source)) {
        options.source(query, plugin.results);
      } else {
        plugin.results(options.source)
      }
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
