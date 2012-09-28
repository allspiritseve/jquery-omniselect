---
layout: default
title: jQuery Omniselect autocomplete plugin
---

# Create custom autocomplete inputs without jQuery UI

jQuery Omniselect is a simple, flexible autocomplete plugin for jQuery that allows you to style results and use any backend you prefer-- it works with arrays, objects, Backbone collections and Ember ArrayControllers.

## $(input_selector).omniselect(options)
The omniselect function accepts an options object

* `source` - An array, object, Backbone collection etc. (basically anything that works with <a href="http://api.jquery.com/filter/">$.filter</a>)
* `get` - Takes a callback with a single parameter `id`. Should return the value matching that id.
* `id` - Takes a callback with a single parameter `value`. Should return the id for that value.
* `label` - Takes a callback with a single parameter `value`. Should return the label for that value that you want shown in the results list.
* `filter` - Takes a callback with two parameters `value` and `query`. Should return the value if it matches the query, otherwise return false.
* `select` - Takes a callback with a single parameter `value`. This will be called when an item is selected from the results (user pressed enter, clicked an item, etc.)

## Backbone Autocomplete Example

{% highlight javascript %}
{% include backbone.js %}
{% endhighlight %}
