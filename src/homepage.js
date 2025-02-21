// #region Dynamic Links for Tabs
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

// #endregion

// #region Platform Tabs

function initPlatTabs() {
  let swiperTabs;

  if (!$('.ai-tabs_wrap').length) return;

  const initSwiper = () => {
    // Create a timeline for better control
    const tl = gsap.timeline();

    return new Swiper('.ai-tabs_slider', {
      slidesPerView: 1,
      spaceBetween: 8,
      autoplay: {
        delay: 15000,
        disableOnInteraction: false,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      on: {
        init: (swiper) => {
          hightlightItem(swiper.realIndex);
          gsap.killTweensOf('.ai-tabs_progress-line');
          gsap.fromTo(
            '.ai-tabs_progress-line',
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 15,
              ease: 'none',
            }
          );
        },
        beforeSlideChange: () => {
          // Immediately kill all tweens of this element
          gsap.killTweensOf('.ai-tabs_progress-line');
          gsap.set('.ai-tabs_progress-line', { scaleX: 0 });
        },
        slideChange: (swiper) => {
          hightlightItem(swiper.realIndex);
          // Force a new tween
          gsap.fromTo(
            '.ai-tabs_progress-line',
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 15,
              ease: 'none',
              immediateRender: true,
            }
          );
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

  observer.observe(document.querySelector('.ai-tabs_wrap'));

  $('.ai-tabs_pane-item').on('click', function () {
    var index = $('.ai-tabs_pane-item').index(this);
    swiperTabs.slideTo(index);
  });

  function hightlightItem(index) {
    $('.ai-tabs_pane-item').removeClass('cc-active');
    $('.ai-tabs_pane-item').eq(index).addClass('cc-active');
  }
}
// init
initPlatTabs();
// #endregion

// #region Platform Tabs

function initAITabs() {
  let swiperTabs;

  if (!$('.hp_development-tabs_content').length) return;

  const initSwiper = () => {
    return new Swiper('.hp_development-tabs_content', {
      slidesPerView: 1,
      spaceBetween: 8,
      autoplay: {
        delay: 15000,
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
          speed: 800,
        },
        992: {
          allowTouchMove: false,
          speed: 0,
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

  observer.observe(document.querySelector('.hp_development-tabs_content'));

  $('.hp_development-tabs_menu-item').on('click', function () {
    var index = $('.hp_development-tabs_menu-item').index(this);
    swiperTabs.slideTo(index);
  });

  function hightlightItem(index) {
    $('.hp_development-tabs_menu-item').removeClass('cc-active');
    $('.hp_development-tabs_menu-item').eq(index).addClass('cc-active');
  }
}
// init
initAITabs();
// #endregion

// #region Customers
const initCustomers = () => {
  // Initialize Swiper
  const customerSwiper = new Swiper('.swiper.swiper-customers', {
    slidesPerView: 'auto',
    spaceBetween: 32,
    threshold: 20,
    resizeObserver: true,
    observer: true,
    observeParents: true,
    pagination: {
      el: `.customer_nav`,
      type: 'bullets',
      bulletActiveClass: 'cc-active',
      bulletClass: 'slider-dot',
      clickable: true,
    },
  });

  // Add click listener to slides
  const slides = document.querySelectorAll('.swiper-customers .swiper-slide');
  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      setTimeout(() => {
        customerSwiper.update();
        customerSwiper.slideTo(index);
      }, 600);
    });
  });

  return customerSwiper;
};

const customerSwiper = initCustomers();
// #endregion

// #region Centralize
const initCentralize = () => {
  let customerSwiper;

  const initializeSwiper = () => {
    if (window.innerWidth <= 767 && !customerSwiper) {
      customerSwiper = new Swiper('.swiper.swiper-centralize', {
        slidesPerView: 1,
        threshold: 20,
        pagination: {
          el: `.centralize_nav`,
          type: 'bullets',
          bulletActiveClass: 'cc-active',
          bulletClass: 'slider-dot',
          clickable: true,
        },
      });
    } else if (customerSwiper) {
      customerSwiper.destroy(true, true);
      customerSwiper = null;
    }
  };

  // Initialize on load
  initializeSwiper();

  // Update on window resize
  window.addEventListener('resize', () => {
    initializeSwiper();
  });
};

initCentralize();
