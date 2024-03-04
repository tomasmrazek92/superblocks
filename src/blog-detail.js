$(document).ready(function () {
  // Top Author
  if ($('.blog-detail_author-item').length === 1) {
    $('#authors-name').text($('.blog-detail_author-item').attr('data-tippy-content'));
  } else if ($('.blog-detail_author-item').length > 5) {
    $('[author-count]').css('display', 'flex');
    $('[author-count]').text(function () {
      var count = $('.blog-detail_author-item').length - 5;
      return count > 0 ? '+' + count : count;
    });

    tippy('[data-tippy-content]', {
      arrow: true,
      animation: 'fade',
      interactive: true,
    });
  }

  // Blog Card Authors
  $('.blog-index_item').each(function () {
    let authors = $(this).find('.blog-index_item-authors-item');
    if (authors.length === 0) {
      $(this).find('.blog-index_item-author-box').hide();
      $(this).find('[authors-name-box]').hide();
      $(this).find('.blog-index_item-line').hide();
    } else if (authors.length === 1) {
      $(this).find('[authors-name]').text(authors.find('img').attr('alt'));
    } else if (authors.length > 1) {
      let counter = $(this).find('.blog-index_item-authors-img.counter');
      counter.css('display', 'flex');
      counter.text(function () {
        var count = authors.length - 1;
        return count > 0 ? '+' + count : count;
      });
    }
  });

  // Copy URL

  var $temp = $('<input>');
  var $url = $(location).attr('href');
  $('#copyUrl').click(function () {
    $('body').append($temp);
    $temp.val($url).select();
    document.execCommand('copy');
    $temp.remove();
  });
});
