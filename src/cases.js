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
