window.blogAuthorsHandler = function (item) {
  // Count the Authors and display accordingly
  $(item).each(function () {
    if (!$(this).hasClass('done')) {
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
      $(this).addClass('done');
    }
  });
};
$(document).ready(function () {
  // Featured
  $('[data-featured-authors]').load(
    `/blog/${featuredSlug} [data-authors-load]`,
    function (response, status, xhr) {
      if (status === 'success') {
        // Call your callback function here, passing any necessary data
        blogAuthorsHandler($('.blog-index_article-featured'));
      }
    }
  );
  /* Load */
  blogAuthorsHandler($('.blog-index_item'));
});

window.fsAttributes = window.fsAttributes || [];

// FS Load
window.fsAttributes.push([
  'cmsload',
  (listInstances) => {
    if ($('.blog-index_item').length > 0) {
      setTimeout(() => {
        $('.blog-index_tag-search-wrap').addClass('loaded');
        togglePagination();
      }, 1000);
    }

    const [listInstance] = listInstances;

    // The `renderitems` event runs whenever the list renders items after switching pages.
    listInstance.on('renderitems', (renderedItems) => {
      let { currentPage } = listInstance;
      currentPage > 1
        ? $('.blog-index_wrap').addClass('filtered')
        : $('.blog-index_wrap').removeClass('filtered');
      blogAuthorsHandler($('.blog-index_item'));
      togglePagination();
    });
  },
]);

// FS Filter
window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    // The callback passes a `filterInstances` array with all the `CMSFilters` instances on the page.
    const [filterInstance] = filterInstances;

    // The `renderitems` event runs whenever the list renders items after filtering.
    filterInstance.listInstance.on('renderitems', function () {
      if (window.matchMedia('(max-width: 991px)').matches) {
        let entries = filterInstance.filtersData[0].values.size;
        if (entries >= 1) {
          // If filters are active, execute this block
          $('.blog-featured').fadeOut('200');
          $('.blog-index_wrap').addClass('filtered');
        } else {
          // If no filters are active, execute this block
          $('.blog-featured').fadeIn('200');
          $('.blog-index_wrap').removeClass('filtered');
        }
      }
    });
  },
]);

// Function
function togglePagination() {
  if ($('.blog-index_pagination-box').find('[fs-cmsload-element="page-button"]').length <= 1) {
    $('.w-pagination-wrapper').hide();
  } else {
    $('.w-pagination-wrapper').css('display', 'flex');
  }
}
