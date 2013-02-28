(function($) {

  "use strict";

  var omniselect = function(spec) {
    
    var defaults = {
      source: [],
      results: '<ul class="omniselect-results"></ul>',
      item: '<li class="omniselect-item"></li>',
      numResults: 10,
      allowAdd: false
    };

    var plugin = {},
      $input = $(spec.input),
      options = $.extend({}, defaults, spec.options),
      renderItem = options.renderItem || renderItem,
      filter = options.filter || filter,
      itemId = options.itemId || itemId,
      itemLabel = options.itemLabel || itemLabel,
      itemValue = options.itemValue || itemValue,
      addLabel = options.addLabel || addLabel,
      $results = $(options.results),
      focused, visible, mouseover, suppressKeyPressRepeat;

    var listen = function() {
      $input.on('focus.omniselect', focus);
      $input.on('blur.omniselect', blur);
      $input.on('keypress.omniselect', keypress);
      $input.on('keyup.omniselect', keyup);
      $input.on('keydown.omniselect', keydown);

      $results.on('click.omniselect', click);
      $results.on('mouseenter.omniselect', 'li', mouseenter);
      $results.on('mouseleave.omniselect', 'li', mouseleave);
    };

    var show = function() {
      $results.insertAfter($input).show();
      visible = true;
      return plugin;
    };

    var hide = function() {
      $results.hide();
      visible = false;
      return plugin;
    };

    var move = function(e) {
      if (!visible) return;

      // Ignore tab, enter or escape
      if (~$.inArray(e.keyCode, [9, 13, 27])) {
        e.preventDefault();
        return;
      }

      // Up arrow
      if (e.keyCode == 38) {
        e.preventDefault();
        previous();
        return;
      }

      // Down arrow
      if (e.keyCode == 40) {
        e.preventDefault();
        next();
        return;
      }

      e.stopPropagation();
    };

    var previous = function() {
      var $current = $results.children('.omniselect-active'),
        $previous = $current.prev();

      if ($previous.length) {
        $current.removeClass('omniselect-active');
        $previous.addClass('omniselect-active');
      }

    };

    var next = function() {
      var $current = $results.children('.omniselect-active'),
        $next = $current.next();

      if ($next.length) {
        $current.removeClass('omniselect-active'),
        $next.addClass('omniselect-active');
      }

    };

    var render = function() {
      var query = $input.val(),
        items = $.isFunction(options.source) ? options.source(query) : options.source;

      if (!query || query.length < 1) {
        return visible ? hide() : plugin;
      }

      $results.empty();

      items
        .filter(function(item) {
          return filter(item, query);
        })
        .slice(0, options.numResults - 1)
        .forEach(function(item, index) {
          var item = renderItem(itemLabel(item), itemId(item), index);
          $results.append(item);
        });

      if (options.allowAdd) {
        var item = renderItem(addLabel(query));
        item.attr('data-omniselect-add', true);
        $results.append(item);
      }

      $results.children(':first').addClass('omniselect-active');

      return show();
    };

    var renderItem = function(label, id, index) {
      var $item = $(options.item).append(label);
      if (id !== undefined) {
        $item.attr('data-omniselect-id', id);
      }
      return $item;
    };

    var filter = function(item, query) {
      return item.match(new RegExp(query, 'i'));
    };

    var itemId = function(item) {
      return undefined;
    };

    var itemLabel = function(item) {
      return item;
    };

    var itemValue = function(item) {
      return item;
    }

    var addLabel = function(query) {
      return "Add '" + query + "'";
    };

    var select = function() {
      var $selected = $results.children('.omniselect-active'),
        id, value;

      if ($selected.data('omniselect-add')) {
        fire('omniselect:add', $input.val());
      } else {
        id = $selected.data('omniselect-id') || $selected.text();
        if (fire('omniselect:select', id)) {
          $input.val(itemValue(id)).change();
        }
      }

      return hide();
    };

    var focus = function() {
      focused = true;
    };

    var blur = function() {
      focused = false;
      if (!mouseover && visible) hide();
    };

    var keydown = function(e) {
      suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      move(e);
    };

    var keypress = function(e) {
      if (suppressKeyPressRepeat) return;
      move(e);
    };

    var keyup = function(e) {
      // Ignore shift, ctrl, alt, up arrow or down arrow
      if (~$.inArray(e.keyCode, [16, 17, 18, 38, 40])) return;

      // Select item if tab or enter
      if (~$.inArray(e.keyCode, [9, 13])) {
        if (visible) select();
        return;
      }

      // Hide if escape
      if (e.keyCode == 27) {
        if (visible) hide();
        return;
      }

      render();

      e.stopPropagation();
      e.preventDefault();
    };

    var click = function(e) {
      e.stopPropagation();
      e.preventDefault();
      select();
      $input.focus();
    };

    var mouseenter = function(e) {
      mouseover = true;
      $results.find('.omniselect-active').removeClass('omniselect-active');
      $(e.currentTarget).addClass('omniselect-active');
    };

    var mouseleave = function(e) {
      mouseover = false;
      if (!focused && visible) hide();
    };

    var fire = function(name, data) {
      var event = $.Event(name);
      $input.trigger(event, data);
      return event.result !== false;
    };

    listen();
  };

  $.fn.omniselect = function(options) {
    return this.each(function() {
      omniselect({ input: this, options: options });
    });
  }

})(jQuery);
