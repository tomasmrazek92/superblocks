
// Dynamic Links for Tabs
  $('.w-tab-link [data-href]').click(function() {
    var url = $(this).attr('data-href');
    var isFullUrl = url.startsWith('http://') || url.startsWith('https://');

    if (isFullUrl) {
      // For full URLs, check the domain
      var currentDomain = window.location.hostname;
      var urlDomain = new URL(url).hostname;

      if (urlDomain !== currentDomain) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    } else {
      // For relative paths, simply navigate to the path
      window.location.pathname = url;
    }
  });


