(function(d){
  function load(src, callback){
    var s = d.createElement('script'),
        onEvent = ('onreadystatechange' in s) ? 'onreadystatechange' : 'onload';

    s[onEvent] = function () {
        if (("loaded,complete").indexOf(this.readyState || "loaded") > -1) {
            s[onEvent] = null;

            // Call your code here
            if (callback) {
              callback(jQuery);
            }
        }
    };

    // Set the src to the combo script url, e.g.
    s.src = src;
    d.getElementsByTagName('head')[0].appendChild(s);
  }

  var FONT_URL_PREFIX = 'http://fonts.googleapis.com/css';
  var API_PATH = "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyByunO2GTypdbmc9izIFPERHIxHSWhh4Sw&callback=?";

  function buildFontUrl(family, variants, subsets) {
    return FONT_URL_PREFIX + "?family=" + family + ":" + variants + "&subset=" + subsets;
  }


  function loadFonts($selector) {
    var data = $selector.data('font-data');
    $selector.html(
      $.map(data.items, function(item) {
        if ($.inArray('latin-ext', item.subsets) !== -1) {
          return '<option value="' + item.variants.join(',') + '" data-subsets="' + item.subsets.join(',') + '">' + item.family + '</option>';
        } else {
          return null;
        }
      }).join('')
    );    
  }


  load('https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function($) {
    function removeCurrentLink() {
      $("link[rel='stylesheet'][href^='" + FONT_URL_PREFIX + "']", $head).remove();
    }

    function selectorChange(e) {
      var $selected = $(this).children(':selected');
      var variants = $selected.val();
      var family = $selected.text();
      var subsets = $selected.attr('data-subsets');

      var href = buildFontUrl(family, variants, subsets);

      removeCurrentLink($head);
      $head.append($("<link/>", 
          { rel: "stylesheet", 
            href: href, 
            type: "text/css" }));
      $head.append("<style> body { font-family: '" + family + "' !important }");
    }

    var $head = $("head");
    var $body = $("body");
    var $selector = $("<select/>")
                    .attr('id', 'font-tester-selector')
                    .change(selectorChange);
    var $toolbar = $('<div/>')
                    .attr('id=', 'font-tester-toolbar')
                    .append($selector);

    $head.append("<style>#font-tester-toolbar { border-bottom: 1px solid #aaa; position: fixed; top: 0; width: 100%; height: 25px; z-index: 10000; text-align: left; background: gainsboro; }</style>");

    $body.append($toolbar);

    $.getJSON(API_PATH, function(data) {
      $selector.data('font-data', data);
      loadFonts($selector);
    });
  });
})(document);
