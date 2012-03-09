(function($) {
  $.multiselect = function(input, options) {
    var plugin = this, $input = $(input), settings,
    defaults = {
      render: function(id,label,index) {
        return $('<li>').attr('data-multiselect-id',id).append('<a>'+label+'</a>');
      },
      numResults: 10,
      allowAdd: false
    };

    plugin.init = function() {
      plugin.settings = settings = $.extend({}, defaults, options);
      $input.attr('autocomplete','off');
      $list = $('<ul>').addClass('multiselect-results').insertAfter($input)
      $input.on('focus.multiselect', function(e) {
        $list.one('click.multiselect','li', function(e) {
          $list.unbind('blur.multiselect');
          plugin.select($(this).data('multiselect-id')).reset();
        });
        $input.one('blur.multiselect', function(e) {
          setTimeout(function() {
            plugin.reset()
          },100);
        });
        $input.on('keydown.multiselect', function(e) {
          return plugin.keydown(e);
        });
        $input.on('keyup.multiselect', function(e) {
          return plugin.keyup(e);
        });
      });
    };

    plugin.keydown = function(e) {
      if (e.keyCode == 27) {
        return plugin.reset();
      }
      if (e.keyCode == 13 || e.keyCode == 9) {
        selected = $list.children('li.selected')
        if (selected.length != 0) {
          plugin.select(selected.data('multiselect-id'));
        }
        return plugin.reset();
      }
      if (e.keyCode == 40) {
        var selected = $list.children('li.selected');
        if (selected[0] != $list.children('li:last')[0]) {
          $next = selected.removeClass('selected').next('li')
          $next.addClass('selected');
          $input.val($next.children('a').html())
        }
        return false;
      }
      if (e.keyCode == 38) {
        var $selected = $list.children('li.selected');
        if ($selected[0] != $list.children('li:first')[0]) {
          $selected.removeClass('selected');
          $prev = $selected.prev('li');
          $prev.addClass('selected');
          $input.val($prev.children('a').html());
        }
        return false;
      }
    }

    plugin.keyup = function(e) {
      if ($.inArray(e.keyCode,[9,13,27,38,40]) != -1) {
        return false;
      }
      var $list = $('.multiselect-results');
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
        $list.prepend(settings.render('multiselect-new-id',$input.val()+' (Add Artist)', -1));
      }
      $list.children('li:first').addClass('selected');
      return false;
    }

    plugin.select = function(selected_id) {
      if (selected_id == 'multiselect-new-id') {
        settings.add($input.val());
      } else {
        settings.select(settings.get(selected_id))
      }
      return plugin;
    }

    plugin.reset = function() {
      $input.val('').blur();
      $list.empty();
      $input.off('keydown.multiselect keyup.multiselect');
      return false;
    }

    var fire = function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    }

    plugin.init();
  };

  $.fn.multiselect = function(options) {
    return this.each(function() {
      if (undefined == $(this).data('multiselect')) {
        var plugin = new $.multiselect(this,options);
        $(this).data('multiselect',plugin);
      }
    });
  }
})(jQuery);
