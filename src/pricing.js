// #region Dynamic Tab Background
const tabParent = $('[data-tabs="parent"]');

// Load
tabParent.each(function () {
  const parent = $(this);
  const tabItems = parent.find('[data-tabs="item"]');
  const bg = parent.find('[data-tabs="bg"]');
  const activeClass = 'is-active';
  let activeItem = tabItems.eq(0);

  // Load
  updateTabsBG(tabItems.eq(0));

  // Click
  tabItems.on('click', function () {
    activeItem = $(this);
    updateTabsBG(activeItem);
  });

  // Resize
  $(window).on('resize', function () {
    updateTabsBG(activeItem);
  });

  function updateTabsBG(el) {
    let item = $(el);
    let parent = item.closest(tabParent);

    // Get Params
    let width = item.outerWidth();
    let itemRect = item[0].getBoundingClientRect();
    let parentRect = parent[0].getBoundingClientRect();

    let position = itemRect.left - parentRect.left;

    // Update them
    bg.css({ width: width, left: position });

    // Tag Item
    tabItems.removeClass(activeClass);
    if (!item.hasClass(activeClass)) {
      item.addClass(activeClass);
    }
  }
});

// #endregion

// #region Price Calc
// Plan Types
const planPrices = [
  [49, 15],
  [70, 21],
];

// Types
var priceType = 0;
var priceDuration = 'annually';
var planType = 0;

function initCalc(calc) {
  // Prices
  let prices = $(calc)
    .find('[fs-rangeslider-element=drag-wrapper]')
    .map(function () {
      let annually = $(this).attr('price-annually');
      let monthly = $(this).attr('price-monthly'); // Get the second attribute

      // Use an object to store the price and second attribute values
      let result = {};

      if (annually) {
        result['annually'] = annually.split(',').map(Number);
      }

      if (monthly) {
        result['monthly'] = monthly.split(',').map(Number);
      }

      return result;
    })
    .get();

  // Elems
  let wrappers = $(calc).find('[fs-rangeslider-element=wrapper]');
  let inputs = $(calc).find('[fs-cmsfilter-field=price]');
  let tabItems = $(calc).find('[data-tabs=item]');
  let proSum = $(calc).find('#calcSum');
  let sumMonth = $(calc).find('#calcSumMonth');
  let sumContent = $(calc).find('[price-calc=sum-content]');
  let sumButton = $(calc).find('[price-calc="button"]');

  // Math
  inputs.on('change', function () {
    if (priceType !== tabItems.length && planType === 0) {
      let projectedPrice = 0;

      inputs.each(function () {
        let val = parseInt($(this).val());
        let index = $(this).closest(wrappers).index();
        let sum = val * prices[index][priceDuration];

        // Accumulate the individual values and sums for the final projection
        projectedPrice += sum;
      });

      // Round the final sums
      projectedPrice = Math.round(projectedPrice);

      let maxSet = false;

      // Check for Maximum
      inputs.each(function () {
        let inputVal = parseInt($(this).val()); // Make sure to parse the input value as integer
        let maximum = parseInt($(this).closest(wrappers).attr('fs-rangeslider-max')); // Assuming 'wrappers' is a defined selector
        // If inputVal equals maximum, set maxSet to true
        if (inputVal === maximum) {
          maxSet = true;
        }
      });

      let contactMax = $(calc).attr('contact-max') === 'true';
      let showYearly = $(calc).attr('show-yearly') === 'true';

      // Case if any row hits maximum and maximum is allowed
      if (maxSet && contactMax) {
        proSum.text('Contact Us');
        sumMonth.hide();
        updateButton(1);
      } else {
        let displayValue = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(showYearly === true ? projectedPrice * 12 : projectedPrice);
        proSum.text(displayValue);
        sumMonth.show();
        updateButton(0);
      }
    }
  });

  // Update Prices
  $('.pricing-tabs_inner-item').on('click', function () {
    let creators = $('#price-creator');
    let users = $('#price-user');

    // Get Plan
    priceType = $(this).index();
    priceDuration = $(this).index() === 0 ? 'annually' : 'monthly';

    // Update
    creators.text('$' + planPrices[priceType][0]);
    users.text('$' + planPrices[priceType][1]);

    // Update Calc
    inputs[0].dispatchEvent(new Event('change'));
  });

  // Calc Tabs
  tabItems.on('click', function () {
    planType = $(this).index();
    planType === 0 ? showPro() : showEnterprise();
    console.log(planType);
  });

  // Functions
  function showPro() {
    inputs[0].dispatchEvent(new Event('change'));
    sumMonth.show();
    sumContent.hide();
    sumContent.eq(0).show();
    updateButton(0);
  }

  function showEnterprise() {
    proSum.text('Custom');
    sumMonth.hide();
    sumContent.hide();
    sumContent.eq(1).show();
    updateButton(1);
  }

  function updateButton(type) {
    if (type === 0) {
      sumButton.eq(0).text('Try it free');
      sumButton.eq(0).attr('href', 'https://app.superblockshq.com/signup');
    } else {
      sumButton.text('Book a demo');
      sumButton.attr('href', 'https://www.superblocks.com/book-a-demo');
    }
  }
}

// Init
jQuery(function () {
  $('.pricing-calc').each(function () {
    initCalc($(this));
  });
  $.getScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-rangeslider@1/rangeslider.js');
});

// #endregion
