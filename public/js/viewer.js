(function() {

  $(function() {
    $('#content pre code').each(function(i, el) {
      return hljs.highlightBlock(el);
    });
    if (window.location.search.indexOf('print') !== -1) return window.print();
  });

}).call(this);
