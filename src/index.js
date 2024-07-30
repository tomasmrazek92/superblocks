$(document).ready(function () {
  // #region Video Modal
  const videoModalSelector = '.video-modal-wrap';
  const videoSelector = `${videoModalSelector} video`;

  function setupVideoTriggers() {
    const $videoModal = $(videoModalSelector);
    const $video = $(videoSelector);

    if (!$videoModal.length || !$video.length) return;

    function showVideo() {
      $videoModal.css('display', 'flex');
      $video[0].load();
      const playPromise = $video[0].play();
      if (playPromise !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        playPromise.then(() => {}).catch(() => {});
      }
    }

    function closeVideo() {
      $videoModal.css('display', 'none');
      $video[0].pause();
      $video[0].currentTime = 0;
    }

    $('[data-toggle="video"]').on('click', showVideo);
    $('[data-toggle="close-video"]').on('click', closeVideo);
  }

  // Init
  setupVideoTriggers();

  // #endregion

  // #region Marquee
  // Function to check if element is in viewport
  function isInViewport(element) {
    var elementTop = $(element).offset().top;
    var elementBottom = elementTop + $(element).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
  }

  // Function to add class when element is in view
  function checkAndAddClass() {
    var element = $('.hp_hero-logo-cms-wrap');
    if (element) {
      if (isInViewport(element)) {
        element.addClass('cc-animated'); // Replace 'your-class' with the class you want to add
        $(window).off('scroll', checkAndAddClass); // Remove scroll event listener once the class is added
      }
    }
  }

  // Check on scroll
  $(window).on('scroll', checkAndAddClass);

  // Initial check in case the element is already in view
  checkAndAddClass();
  // #endregion

  // #region Nav Open/Close
  let ham = '.nav_burger';
  let menuOpen = false;
  let scrollPosition;
  $(ham).on('click', function () {
    disableScroll();
  });

  const disableScroll = () => {
    if (!menuOpen) {
      scrollPosition = $(window).scrollTop();
      $('html, body').scrollTop(0).addClass('overflow-hidden');
    } else {
      $('html, body').scrollTop(scrollPosition).removeClass('overflow-hidden');
    }
    menuOpen = !menuOpen;
  };

  // Add Class on Scroll
  function checkNav() {
    var scroll = $(window).scrollTop();
    let nav = $('.nav_wrapper');
    if (typeof nav.attr('fixed-by-default') === 'undefined') {
      if (scroll >= 100) {
        nav.addClass('fixed');
      } else if (scroll === 0) {
        nav.removeClass('fixed');
      }
    }
  }

  // Init
  $(window).scroll(checkNav);
  checkNav();
  // #endregion

  // #region Modal Opens
  function setupModalTriggers() {
    const modalTriggers = $('[data-toggle="modal"]');
    const modal = $('[data-element="modal"]');
    const modalClose = $('[data-toggle="modal-close"]');

    if (!modalTriggers.length) return;

    function showModal() {
      modal.fadeIn();
      disableScroll();
    }

    function closeModal() {
      modal.fadeOut();
      disableScroll();
    }

    modalTriggers.on('click', showModal);
    modalClose.on('click', closeModal);
  }

  // Init
  setupModalTriggers();

  // #endregion
});
