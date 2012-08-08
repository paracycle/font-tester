(function($){
  var html= '<div id="toolbar" style="border-bottom: 1px solid #aaa; position: fixed; top: 0; width: 100%; height: 25px; z-index: 10000"><select id="font"></select></div>';
  $("body").append(html);

  url = "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyByunO2GTypdbmc9izIFPERHIxHSWhh4Sw&callback=?"

  $.getJSON(url, function(data) {
    $("select#font").html(
      $.map(data.items, function(item) {
        console.log (item.subsets);
        if ($.inArray('latin-ext', item.subsets))
          return '<option value="' + item.family + '">' + item.family + '</option>';
        else
          return null;
      }).join('')
    ).change(function (e) {
      var family = $("select#font").val();
      var $head = $("head");
      $("link[rel='stylesheet'][href^='http://fonts.googleapis.com/css']", $head).remove();
      $head.append($("<link/>", 
          { rel: "stylesheet", 
            href: "http://fonts.googleapis.com/css?family=" + family + "&subset=latin,latin-ext", 
            type: "text/css" }));
      $head.append("<style> body { font-family: '" + family + "' !important }");
      //$('body').css("font-family", "'" + family + "' !important");
    });
  })
})(jQuery)
