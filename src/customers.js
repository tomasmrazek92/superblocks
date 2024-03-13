import { initSwipers } from './utils/globalFunctions';

// Sample data for swiperInstances, specific to this page
const swiperInstances = [
  [
    '.section_cstm-tstmn',
    '.cstm-tstmn_wrap',
    'testimonials',
    {
      autoplay: { delay: 7000 },
      breakpoints: {
        0: {
          spaceBetween: 20,
          slidesPerView: 1,
          slidesPerGroup: 1,
          grid: {},
        },
        992: {
          spaceBetween: 0,
          slidesPerView: 2,
          slidesPerGroup: 2,
          grid: {
            fill: 'column',
            rows: 2,
          },
        },
      },
    },
    'all',
  ],
];

$(document).ready(() => {
  function calculateHeight() {
    if ($(window).width() >= 992) {
      let totalHeight = 0;
      $('.cstm-tstmn_item')
        .slice(0, 2)
        .each(function () {
          totalHeight += $(this).outerHeight();
        });

      $('.cstm-tstmn_wrap').height(totalHeight);
      $('.cstm-tstmn_item').width('100%');
    } else {
      $('.cstm-tstmn_wrap').height('auto');
    }
  }

  // Init
  calculateHeight();
  setTimeout(() => {
    initSwipers(swiperInstances);
  }, 300);

  // Resize
  $(window).on('resize', function () {
    calculateHeight();

    setTimeout(() => {
      swipers = {};
    }, 300);
  });
});
