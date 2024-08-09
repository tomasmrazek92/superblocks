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
const swiperTestNav = new Swiper('.cases_nav-slide', {
  slidesPerView: 4,
  slideToClickedSlide: true,
  threshold: 20,
  navigation: {
    nextEl: '.swiper-arrow.next',
    prevEl: '.swiper-arrow.prev',
  },
  loop: true,
  breakpoints: {
    0: {
      slidesPerView: 'auto',
    },
    768: {
      slidesPerView: 4,
    },
    992: {
      slidesPerView: 5,
    },
  },
  on: {
    init: (swiper) => {
      updateQuote(swiper.realIndex);
    },
    slideChange: (swiper) => {
      updateQuote(swiper.realIndex);
    },
  },
});

function updateQuote(index) {
  let slide = $('.swiper-slide.case-study').not('.swiper-slide-duplicate').eq(index);
  let el = slide.find('.cases_nav-item');
  let companyText = $(el).attr('data-company');
  let quoteText = $(el).attr('data-quote');
  let nameText = $(el).attr('data-name');
  let roleText = $(el).attr('data-role');
  let picSrc = $(el).find('.w-embed').find('div').attr('data-pic');
  let visualSrc = $(el).find('.w-embed').find('div').attr('data-visual');
  let link = $(el).attr('data-link');

  $('[data-quote="el"]').text(quoteText);
  $('[data-name="el"]').text(nameText);
  $('[data-role="el"]').text(roleText);
  $('[data-pic="el"]').attr('src', picSrc);

  if (companyText === 'Alchemy') {
    $('.cases_lightbox').css('display', 'flex');
    $('[data-visual="el"]').hide();
  } else {
    $('[data-visual="el"]').attr('src', visualSrc);
    $('.cases_lightbox').hide();
    $('[data-visual="el"]').show();
  }

  if (link !== '') {
    $('[data-link="el"]').attr('href', link);
    $('[data-link="el"]').css('pointer-events', 'auto');
  } else {
    $('[data-link="el"]').css('pointer-events', 'none');
    $('[data-link="el"]').attr('href', '#');
  }
}

// Platform Tabs
// Encapsulate Swiper initialization within a function

let swiperTabs;

const initSwiper = () => {
  return new Swiper('.platform-tabs_content', {
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

observer.observe(document.querySelector('.platform-tabs_content'));

$('.platform-tabs_menu-item').on('click', function () {
  var index = $('.platform-tabs_menu-item').index(this);
  swiperTabs.slideTo(index);
});

function hightlightItem(index) {
  $('.platform-tabs_menu-item').removeClass('cc-active');
  $('.platform-tabs_menu-item').eq(index).addClass('cc-active');
}
