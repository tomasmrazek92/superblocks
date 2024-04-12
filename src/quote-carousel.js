import { initSwipers } from './utils/globalFunctions';

// Sample data for swiperInstances, specific to this page
const swiperInstances = [
  [
    '[data-carousel="quote-big"]',
    '.w-dyn-list',
    'quote-big',
    {
      autoplay: { delay: 7000 },
      slidesPerView: 1,
      autoHeight: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
    },
    'all',
  ],
];

initSwipers(swiperInstances);
