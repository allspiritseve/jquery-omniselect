!function($) {

  "use strict";

  var omniselect = function(spec) {
    var plugin = {}
    
    var defaults = {
      show: 'focus',
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

    plugin.focus = function() {
      focused = true;
    };

    plugin.blur = function() {
      focused = false;
      if (!mouseover && visible) {
        plugin.hide();
      }
    };

    plugin.show = function() {
      $input.on('keyup.omniselect', plugin.keyup)
        .on('keydown.omniselect', plugin.keydown);
      $results.insertAfter($input).show()
        .on('click.omniselect', plugin.click)
        .on('mouseenter.omniselect', 'li', plugin.mouseenter)
        .on('mouseleave.omniselect', 'li', plugin.mouseleave);
    };

    plugin.hide = function() {
      visible = false;
      $input.off('keydown.omniselect')
        .off('keyup.omniselect');
      $results.hide()
        .off('click.omniselect')
        .off('mouseenter.omniselect', 'li')
        .off('mouseleave.omniselect', 'li');
    };

    plugin.search = function(query) {
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
        case keys.escape:
          if (visible) { plugin.hide() }
          return;
      }
    };

    plugin.click = function() {
      plugin.select();
      return false;
    };

    plugin.mouseenter = function(e) {
      mouseover = true;
      var id = $(e.currentTarget).data('omniselect-id')
      plugin.focusItem(id);
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
      console.log('Previous');
      if (currentItemIndex > 0) {
        plugin.setCurrentItemIndex(currentItemIndex - 1);
      } else {
        if (options.cycle) {
          plugin.setCurrentItemIndex(results.length - 1);
        } else {
          // plugin.setCurrentItemIndex(0);
        }
      }
    }

    plugin.next = function() {
      if (currentItemIndex < results.length) {
        plugin.setCurrentItemIndex(currentItemIndex + 1);
      } else {
        if (options.cycle) {
          plugin.setCurrentItemIndex(0);
        } else {
          // plugin.setCurrentItemIndex(results.length - 1);
        }
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

    return plugin;
  };

  /*
  $.fn.omniselect = function(options) {
    return this.each(function() {
      omniselect({ input: this, options: options });
    });
  }
  */

  $.fn.omniselect2 = function(options) {
    return this.each(function() {
      var $input = $(this),
        dropdown = omniselect({ input: this, options: options }),
        lastQuery;

      var init = function() {
        $input.on('focus', focus).on('blur', blur);
      };

      var focus = function() {
        console.log('Outer focus');
        dropdown.focus();
        $input.on('keyup.omniselect', keyup);
      };

      var blur = function() {
        console.log('Outer blur');
        dropdown.blur();
        $input.off('keyup.omniselect')
      };

      var keyup = function(e) {
        console.log('Outer keyup');
        var query = $input.val();
        if (query != lastQuery) {
          dropdown.search(query);
          lastQuery = query;
        }
      };

      init();
    });
  };

}(jQuery);