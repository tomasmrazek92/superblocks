window.fsAttributes = window.fsAttributes || [];

// FS Filter
window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    // The callback passes a `filterInstances` array with all the `CMSFilters` instances on the page.
    const [filterInstance] = filterInstances;
    console.log(filterInstance);

    // The `renderitems` event runs whenever the list renders items after filtering.
    filterInstance.listInstance.on('renderitems', function () {
      let entries = filterInstance.filtersData[0].values.size;
      if (entries >= 1) {
        // If filters are active, execute this block
        $('.uiblocks_wrap.cc-index').hide();
        $('.uiblocks_wrap.cc-all').fadeIn();
      } else {
        // If no filters are active, execute this block
        $('.uiblocks_wrap.cc-index').fadeIn();
        $('.uiblocks_wrap.cc-all').hide();
      }
    });
  },
]);

$(document).ready(function () {
  // Select all items within the .uiblocks_wrap.cc-all container
  const $items = $('.uiblocks_wrap.cc-all [fs-cmsfilter-field="category"]');

  // Create a Map to store the count of each category
  const categoryMap = new Map();

  // Count the occurrences of each category
  $items.each(function () {
    const category = $(this).text().trim(); // Get the category text
    if (category) {
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    }
  });

  // Update text for matching elements based on the category map
  categoryMap.forEach((count, category) => {
    const $match = $(`[total-count="${category}"]`);
    if ($match.length) {
      $match.text(count); // Update the text with the count value
    }
  });

  console.log('Updated text for matching elements:', Object.fromEntries(categoryMap));
});
