$(document).ready(function () {
  // #region Video Modal

  function setupVideoTriggers() {
    const $videoModal = $('.video-modal-wrap');
    const $video = $videoModal.find(`video`).length
      ? $videoModal.find(`video`)
      : $videoModal.find('[data-vimeo-player-init]');
    console.log($video);

    if (!$videoModal.length || !$video.length) return;

    function showVideo() {
      // Fade in the modal
      $videoModal.css('display', 'flex').hide().fadeIn(400);

      // Check if we're dealing with HTML5 video
      if ($video.is('video')) {
        $video[0].load();
        const playPromise = $video[0].play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Video playing successfully
              $videoModal.addClass('playing');
            })
            .catch((error) => {
              // Auto-play was prevented
              console.log('Autoplay prevented, user interaction needed');
            });
        }
      }
      // For Vimeo iframe player
      else if ($video.is('[data-vimeo-player-init]')) {
        $video.find('[data-vimeo-control="play"]')[0].click();
      }
    }

    function closeVideo() {
      // Fade out the modal
      $videoModal.fadeOut(300, function () {
        // Reset video state after fade completes
        if ($video.is('video')) {
          $video[0].pause();
          $video[0].currentTime = 0;
        }
        // For Vimeo iframe player
        else if ($video.is('[data-vimeo-player-init]')) {
          $video.find('[data-vimeo-control="pause"]')[0].click();
        }
        $videoModal.removeClass('playing');
      });
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
    if (element.length) {
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
