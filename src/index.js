$(document).ready(function () {
  // #region Video Modal

  function setupVideoTriggers() {
    const $videoModal = $('.video-modal-wrap');
    const $video = $videoModal.find(`video`).length
      ? $videoModal.find(`video`)
      : $videoModal.find('[data-vimeo-player-init]');

    if (!$videoModal.length || !$video.length) return;

    function showVideo() {
      // Fade in the modal
      $videoModal
        .css('display', 'flex')
        .hide()
        .fadeIn(400, () => {
          // Check if we're dealing with HTML5 video
          if ($video.is('video') && $video.is(':visible')) {
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
          else if ($video.is('[data-vimeo-player-init]') && $video.is(':visible')) {
            $video.find('[data-vimeo-control="play"]')[0].click();
          }
        });
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

  function initModalBasic() {
    const modalGroup = document.querySelector('[data-modal-group-status]');
    const modals = document.querySelectorAll('[data-modal-name]');
    const modalTargets = document.querySelectorAll('[data-modal-target]');

    // Open modal
    modalTargets.forEach((modalTarget) => {
      modalTarget.addEventListener('click', function () {
        const modalTargetName = this.getAttribute('data-modal-target');

        // Close all modals
        modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
        modals.forEach((modal) => modal.setAttribute('data-modal-status', 'not-active'));

        // Activate clicked modal
        let activeTrigger = document.querySelector(`[data-modal-target="${modalTargetName}"]`);
        let activeModal = document.querySelector(`[data-modal-name="${modalTargetName}"]`);

        activeTrigger.setAttribute('data-modal-status', 'active');
        activeModal.setAttribute('data-modal-status', 'active');

        // Set group to active
        if (modalGroup) {
          modalGroup.setAttribute('data-modal-group-status', 'active');
        }

        const $video = $(activeModal).find(`video`).length
          ? $(activeModal).find(`video`)
          : $(activeModal).find('[data-vimeo-player-init]');

        if ($video.length) {
          playModalVideo($video);
        }
      });
    });

    // Close modal
    document.querySelectorAll('[data-modal-close]').forEach((closeBtn) => {
      closeBtn.addEventListener('click', closeAllModals);
    });

    // Close modal on `Escape` key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeAllModals();
      }
    });

    // Function to close all modals
    function closeAllModals() {
      modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));

      if (modalGroup) {
        modalGroup.setAttribute('data-modal-group-status', 'not-active');
      }

      const $videos = $('[data-modal-name]').find('video, [data-vimeo-player-init]');

      if ($videos.length) {
        $videos.each(function () {
          pauseModalVideo($(this));
        });
      }
    }

    function playModalVideo(video) {
      let $video = $(video);
      // Check if we're dealing with HTML5 video
      if ($video.is('video') && $video.is(':visible')) {
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
      else if ($video.is('[data-vimeo-player-init]') && $video.is(':visible')) {
        $video.find('[data-vimeo-control="play"]')[0].click();
      }
    }

    function pauseModalVideo(video) {
      let $video = $(video);
      // Reset video state after fade completes
      if ($video.is('video')) {
        $video[0].pause();
        $video[0].currentTime = 0;
      }
      // For Vimeo iframe player
      else if ($video.is('[data-vimeo-player-init]')) {
        $video.find('[data-vimeo-control="pause"]')[0].click();
      }
    }
  }

  // Initialize Basic Modal
  initModalBasic();

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
  let navWrapper = '.nav_wrapper';
  let menuOpen = false;
  let scrollPosition;
  $(ham).on('click', function () {
    disableScroll();
  });

  const disableScroll = () => {
    if (!menuOpen) {
      scrollPosition = $(window).scrollTop();
      $('html, body').scrollTop(0).addClass('overflow-hidden');
      $(navWrapper).addClass('cc-open');
    } else {
      $('html, body').scrollTop(scrollPosition).removeClass('overflow-hidden');
      $(navWrapper).removeClass('cc-open');
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

  // Hide snackClark
  function trackSnackClark() {
    let snackBanner = $('.snackbar-clark');

    if (snackBanner.length) {
      $(navWrapper).addClass('clark-snack');
      function updateBannerHeight() {
        let height = snackBanner.outerHeight();
        document.documentElement.style.setProperty('--clarkSnack', height + 'px');
      }

      const observer = new ResizeObserver(() => {
        updateBannerHeight();
      });

      observer.observe(snackBanner[0]);

      $(window).on('resize', updateBannerHeight);

      updateBannerHeight();
    }
  }

  // Init
  $(window).scroll(checkNav);
  checkNav();
  trackSnackClark();
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
