(function($) {

  $.omniselect = function(input, options) {
    var plugin = this, $input = $(input), settings,
    defaults = {
      render: function(id,label,index) {
        return $('<li>').attr('data-omniselect-id',id).append(label);
      },
      numResults: 10,
      allowAdd: true,
      clearOnReset: false
    };

    plugin.init = function() {
      plugin.defaults = defaults
      plugin.settings = settings = $.extend({}, defaults, options);
      $input.attr('autocomplete','off');
      $list = plugin.getResultsWrapper();
      $list.addClass('omniselect-results');
      $input.on('focus.omniselect', function(e) {
        $list.one('click.omniselect','li', function(e) {
          $list.unbind('blur.omniselect');
          plugin.select($(this).data('omniselect-id')).reset();
        });
        $input.one('blur.omniselect', function(e) {
          setTimeout(plugin.blur,100);
        });
        $input.on('keydown.omniselect', function(e) {
          return plugin.keydown(e);
        });
        $input.on('keyup.omniselect', function(e) {
          return plugin.keyup(e);
        });
      });
    };

    plugin.keydown = function(e) {
      $input.off('keydown.omniselect');
      setTimeout(function() {
        $input.on('keydown.omniselect', function(e) {
          return plugin.keydown(e);
        });
      },100);
      if (e.keyCode == 27) {
        return plugin.reset();
      }
      /* If the user presses enter or tab, select current tab */
      if (e.keyCode == 13 || e.keyCode == 9) {
        selected = $list.children('li.selected')
        if (selected.length != 0) {
          plugin.select(selected.data('omniselect-id'));
        }
        if (e.keyCode == 13) {
          return plugin.reset();
        } else {
          return plugin.blur();
        }
      }
      /* If the user presses the down arrow, highlight next tab */
      if (e.keyCode == 40) {
        var $selected = $list.children('li.selected');
        if ($selected[0] != $list.children('li:last')[0]) {
          $next = $selected.removeClass('selected').next('li')
          $next.addClass('selected');
          // $input.val(settings.value($next.data('omniselect-id')));
        }
        return false;
      }
      /* If the user presses the up arrow, highlight previous tab */
      if (e.keyCode == 38) {
        var $selected = $list.children('li.selected');
        if ($selected[0] != $list.children('li:first')[0]) {
          $selected.removeClass('selected');
          $prev = $selected.prev('li');
          $prev.addClass('selected');
          // $input.val(settings.value($prev.data('omniselect-id')));
        }
        return false;
      }
    }

    plugin.keyup = function(e) {
      if ($.inArray(e.keyCode,[9,13,27,38,40]) != -1) {
        return false;
      }
      var $list = $('.omniselect-results');
      if ($input.val().length == 0) {
        $list.empty();
        return false;
      }

      var matches = settings.source().filter(function(match) {
        return settings.filter(match,$input.val());
      }).slice(0,settings.numResults - 1)

      $list.empty();
      $.map(matches, function(match,index) {
        $list.append(settings.render(settings.id(match), settings.label(match), index));
      });

      if (settings.allowAdd && $.inArray($input.val(),matches) == -1) {
        $list.append(settings.render('omniselect-new-id','Add artist: ' + $input.val(), -1));
      }
      $list.children('li:first').addClass('selected');
      return false;
    }

    plugin.select = function(selected_id) {
      if (selected_id == 'omniselect-new-id') {
        settings.add($input.val());
      } else {
        settings.select(settings.get(selected_id))
      }
      return plugin;
    }

    plugin.reset = function() {
      $list.empty();
      if (settings.clearOnReset) {
        $input.val('');
      }
      return false;
    }

    plugin.blur = function() {
      plugin.reset();
      $input.blur().off('keydown.omniselect keyup.omniselect');
      return false;
    }

    plugin.getResultsWrapper = function() {
      if (settings.resultsWrapper) {
        $list = $(settings.resultsWrapper);
        if (!$list.length) {
          $.error('Could not find results wrapper with selector ' + settings.resultsWrapper);
        }
      } else {
        $list = $('<ul>').insertAfter($input);
      }
      $list.addClass('omniselect-results');
      return $list;
    }

    var fire = function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    }

    plugin.init();
  };

  $.fn.omniselect = function(options) {
    return this.each(function() {
      if (undefined == $(this).data('omniselect')) {
        var plugin = new $.omniselect(this,options);
        $(this).data('omniselect',plugin);
      }
    });
  }
})(jQuery);
