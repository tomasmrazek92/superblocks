window.fsAttributes = window.fsAttributes || [];

// FS Load
window.fsAttributes.push([
  'cmsload',
  (filterInstances) => {
    console.log('cmsfilter Successfully loaded!');

    // The callback passes a `filterInstances` array with all the `CMSFilters` instances on the page.
    const [filterInstance] = filterInstances;

    // Categories
    let categories = [];

    function addKeyword(keyword) {
      categories.push(keyword);
    }

    // Add all references
    filterInstance.items.forEach((element) => {
      addKeyword(element.props.category.values.values().next().value);
    });

    // Count different categories
    function countKeywords(keywordsArray) {
      return keywordsArray.reduce((acc, keyword) => {
        acc[keyword] = (acc[keyword] || 0) + 1;
        return acc;
      }, {});
    }
    const keywordCounts = countKeywords(categories);

    // Add the associated count
    $('[total-count]').text(filterInstance.items.length);
    $('.w-dyn-items .intgr-types_item').each(function () {
      // In each '.intgr-types_item', find the span and get its text
      var spanText = $(this).find('span').text();

      // Check if the span's text matches one of the keywords
      if (keywordCounts[spanText] !== undefined) {
        // Find the '.small-tag' within the current '.intgr-types_item' and update its text
        $(this).find('.small-tag').text(keywordCounts[spanText]);
      }
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
      // Case if there are no items
      let items = filterInstance.listInstance.validItems.length;
      items === 0 ? hideSidePanel(true) : hideSidePanel(false);

      togglePagination();
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

function hideSidePanel(state) {
  if (state) {
    $('.intgr-types_wrap').css({
      height: '0px',
      width: '0px',
      'padding-left': '0px',
      'padding-right': '0px',
    });
  } else {
    $('.intgr-types_wrap').attr('style', '');
  }
}
