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
});
