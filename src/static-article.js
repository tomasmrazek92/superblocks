import { copyUrl } from './utils/globalFunctions';

// #region Dynamic Anchor Links
function dynamicAnchorLinks() {
  // Find all .blog-p_rich-text elements
  var richTextElements = $('.w-richtext');

  // Iterate over each element
  richTextElements.each(function () {
    var element = $(this);

    // Find h2, h3, and h4 tags inside the element
    var headings = element.find('h2, h3, h4');

    // Iterate over each heading
    headings.each(function () {
      var heading = $(this);

      // Get the text of the heading
      var headingText = heading.text();

      // Create a new div element with the class "retool-alt_anchor" and an id based on the heading text
      var div = $('<div>').addClass('article_anchor').attr('id', formatAsAnchorLink(headingText));

      // Insert the div element above the heading
      heading.after(div);
    });
  });

  // Function to format the heading text as an anchor link
  function formatAsAnchorLink(text) {
    // Remove non-alphanumeric characters
    var formattedText = text.replace(/[^a-zA-Z0-9 ]/g, '');

    // Replace spaces with underscores
    formattedText = formattedText.replace(/\s+/g, '_');

    // Convert to lowercase
    formattedText = formattedText.toLowerCase();

    return formattedText;
  }
}
// #endregion

// #region Table Column Reorder
function reorderForm(table, order) {
  // Reorder the header row, account for the use of id instead of headers
  reorderColumns(order, $(table).find('thead tr'), true);

  // Reorder each body row, also excluding the first <th>
  $(table)
    .find('tbody tr')
    .each(function () {
      reorderColumns(order, $(this), false);
    });

  function reorderColumns(orderArray, $row, isHeader) {
    var $cells = isHeader ? $row.children('th:not(:first-child)') : $row.children('td');
    var $firstTh = $row.children('th:first-child');
    var $placeholder = $('<td>').hide();

    $placeholder.appendTo($row);

    orderArray.forEach(function (headerId) {
      var selector = isHeader ? '#' + headerId : '[headers*="' + headerId + '"]';
      $cells.filter(selector).appendTo($row);
    });

    $placeholder.remove();
    $firstTh.prependTo($row);
  }
}

// Expose reorderForm to the global window object
window.reorderForm = reorderForm;
// #endregion

$(document).ready(() => {
  // Load Functions
  dynamicAnchorLinks();
  copyUrl();

  // Tooltips
  tippy('[data-tippy-content]', {
    arrow: true,
    animation: 'fade',
  });
});
