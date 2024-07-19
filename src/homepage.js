// Dynamic Links for Tabs
$('.w-tab-link [data-href]').click(function () {
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

// Testimonials
const swiperTestContent = new Swiper('.cases_content-slide', {
  slidesPerView: 1,
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
  slideToClickedSlide: true,
  allowTouchMove: false,
  autoHeight: true,
  centeredSlides: true,
  loop: true,
});

const swiperTestNav = new Swiper('.cases_nav-slide', {
  slidesPerView: 'auto',
  slideToClickedSlide: true,
  navigation: {
    nextEl: '.swiper-arrow.next',
    prevEl: '.swiper-arrow.prev',
  },
  centeredSlides: true,
  loop: true,
  // Add controller
  controller: {
    control: swiperTestContent,
  },
});

// Platform Tabs
// Encapsulate Swiper initialization within a function

let swiperTabs;

const initSwiper = () => {
  return new Swiper('.platform-tabs_content', {
    slidesPerView: 1,
    effect: 'fade',

    fadeEffect: {
      crossFade: true,
    },
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.platform-tabs_nav',
      type: 'bullets',
      bulletActiveClass: 'cc-active',
      bulletClass: 'slider-dot',
      clickable: true,
    },
    breakpoints: {
      0: {
        allowTouchMove: true,
      },
      992: {
        allowTouchMove: false,
      },
    },

    on: {
      init: (swiper) => {
        hightlightItem(swiper.realIndex);
      },
      slideChange: (swiper) => {
        hightlightItem(swiper.realIndex);
      },
    },
  });
};

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        swiperTabs = initSwiper(); // Initialize Swiper when the element is in view
        observer.disconnect(); // Stop observing after initialization
      }
    });
  },
  { threshold: 0.1 }
); // Adjust the threshold as needed

observer.observe(document.querySelector('.platform-tabs_content'));

$('.platform-tabs_menu-item').on('click', function () {
  var index = $('.platform-tabs_menu-item').index(this);
  swiperTabs.slideTo(index);
});

function hightlightItem(index) {
  $('.platform-tabs_menu-item').removeClass('cc-active');
  $('.platform-tabs_menu-item').eq(index).addClass('cc-active');
}
