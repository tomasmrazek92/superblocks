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

// #region AI Tabs
function initAITabs() {
  let swiperTabs;

  if (!$('.ai-tabs_wrap').length) return;

  const initSwiper = () => {
    // Create a timeline for better control
    const tl = gsap.timeline();

    return new Swiper('.ai-tabs_slider', {
      slidesPerView: 'auto',
      spaceBetween: 8,
      autoplay: {
        delay: 15000,
        disableOnInteraction: false,
      },
      loop: true,
      pagination: {
        el: '.platform-tabs_nav',
        type: 'bullets',
        bulletActiveClass: 'cc-active',
        bulletClass: 'slider-dot',
        clickable: true,
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
    swiperTabs.slideToLoop(index);
  });

  function hightlightItem(index) {
    $('.ai-tabs_pane-item').removeClass('cc-active');
    $('.ai-tabs_pane-item').eq(index).addClass('cc-active');
  }
}
// init
initAITabs();
// #endregion

// #region Platform Tabs
function initPlatTabs() {
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
initPlatTabs();
// #endregion

// #region Customers
const initCustomers = () => {
  // Initialize Swiper
  const customerSwiper = new Swiper('.swiper.swiper-customers', {
    slidesPerView: 'auto',
    spaceBetween: 32,
    speed: 600,
    threshold: 20,
    mousewheel: {
      enabled: true,
      forceToAxis: true,
    },
    pagination: {
      el: `.customer_nav`,
      type: 'bullets',
      bulletActiveClass: 'cc-active',
      bulletClass: 'slider-dot',
      clickable: true,
    },
    breakpoints: {
      // When window width is >= 992px (desktop)
      992: {
        freeMode: {
          enabled: true,
        },
      },
    },
    on: {
      init: function () {
        initVimeoPlayer();
      },
      beforeSlideChangeStart: function () {
        if (window.innerWidth <= 991) {
          resetInactiveVimeoPlayers();
        }
      },
    },
  });

  // Function to reset all Vimeo players except the one in the provided container
  function resetInactiveVimeoPlayers(excludeContainer) {
    // Get all Vimeo players
    const allVimeoPlayers = $('[data-vimeo-player-init]');

    // If we have an exclude container, find the player inside it
    let excludePlayerId = null;
    if (excludeContainer) {
      const playerInContainer = $(excludeContainer).find('[data-vimeo-player-init]');
      if (playerInContainer.length > 0) {
        excludePlayerId = playerInContainer.attr('id');
      }
    }

    // Process all players
    allVimeoPlayers.each(function () {
      // Skip if this is the player we want to exclude
      if (excludePlayerId && $(this).attr('id') === excludePlayerId) {
        return true; // This is jQuery's .each() version of "continue"
      }

      // Set data-vimeo-activated to false for all inactive players
      $(this).attr('data-vimeo-activated', 'false');

      // Only pause the players that are currently playing
      if ($(this).attr('data-vimeo-playing') === 'true') {
        const playerId = $(this).attr('id');

        // Update playing state
        $(this).attr('data-vimeo-playing', 'false');

        // Use our global pause function
        if (playerId && window.vimeoPlayerInstances && window.vimeoPlayerInstances[playerId]) {
          window.vimeoPlayerInstances[playerId].pause();
        }
      }
    });
  }

  // Add additional method to force update after potential dimension changes
  const forceRecalculateSwiper = (index) => {
    if (customerSwiper) {
      // Force update layout
      customerSwiper.updateSize();
      customerSwiper.updateSlides();
      customerSwiper.updateProgress();
      customerSwiper.updateSlidesClasses();
      customerSwiper.slideTo(index);
      customerSwiper.update();
    }
  };

  // Add click listener to slides
  const slides = document.querySelectorAll('.swiper-customers .swiper-slide');
  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      resetInactiveVimeoPlayers($(slide));
      setTimeout(() => {
        forceRecalculateSwiper(index);
      }, 700);
    });
  });

  $('[data-vimeo-control="close"').on('click', function () {
    resetInactiveVimeoPlayers();
  });

  // Listen for Vimeo video events that might affect size
  $(document).on('play', '[data-vimeo-player-init]', function () {
    setTimeout(forceRecalculateSwiper, 200);
  });

  return customerSwiper;
};
const customerSwiper = initCustomers();

function initVimeoPlayer() {
  // Create a global object to store player instances
  window.vimeoPlayerInstances = {};

  // Array to track loading promises
  window.vimeoLoadPromises = [];

  // Select all elements that have [data-vimeo-player-init]
  const vimeoPlayers = document.querySelectorAll('[data-vimeo-player-init]');

  vimeoPlayers.forEach(function (vimeoElement, index) {
    // Add Vimeo URL ID to the iframe [src]
    const vimeoVideoID = vimeoElement.getAttribute('data-vimeo-video-id');
    if (!vimeoVideoID) return;

    // Assign an ID to each element
    const videoIndexID = 'vimeo-player-index-' + index;
    vimeoElement.setAttribute('id', videoIndexID);

    // Create a promise for this video's loading
    const loadPromise = new Promise((resolve) => {
      // Add URL after we've setup the promise to ensure we don't miss events
      const vimeoVideoURL = `https://player.vimeo.com/video/${vimeoVideoID}?api=1&background=1&autoplay=0&loop=0&muted=1&quality=auto`;
      vimeoElement.querySelector('iframe').setAttribute('src', vimeoVideoURL);

      const iframeID = vimeoElement.id;
      const player = new Vimeo.Player(iframeID);

      // Force timeout to resolve promise after 3s in case of issues
      const timeoutId = setTimeout(() => {
        console.log(`Timeout reached for video ${vimeoVideoID}`);
        vimeoElement.setAttribute('data-vimeo-preloaded', 'timeout');
        resolve(videoIndexID);
      }, 3000);

      // Listen for the loaded event
      // Listen for the loaded event
      player.on('loaded', function () {
        // Video metadata is loaded, now try to buffer some content
        player
          .setCurrentTime(0)
          .then(() => {
            // After seeking to beginning, play a tiny bit then immediately pause
            // This forces the browser to buffer the start of the video
            player
              .play()
              .then(() => {
                setTimeout(() => {
                  player.pause().then(() => {
                    clearTimeout(timeoutId);
                    vimeoElement.setAttribute('data-vimeo-preloaded', 'true');
                    console.log(`Video ${vimeoVideoID} preloaded`);
                    resolve(videoIndexID);
                  });
                }, 100); // Play for 100ms to force buffering
              })
              .catch(() => {
                // If play fails, still resolve
                clearTimeout(timeoutId);
                vimeoElement.setAttribute('data-vimeo-preloaded', 'partial');
                console.log(`Video ${vimeoVideoID} partially preloaded`);
                resolve(videoIndexID);
              });
          })
          .catch(() => {
            // If seeking fails, still resolve
            clearTimeout(timeoutId);
            vimeoElement.setAttribute('data-vimeo-preloaded', 'minimal');
            console.log(`Video ${vimeoVideoID} minimally preloaded`);
            resolve(videoIndexID);
          });
      });

      // Function: Play Video
      function vimeoPlayerPlay() {
        vimeoElement.setAttribute('data-vimeo-activated', 'true');
        vimeoElement.setAttribute('data-vimeo-playing', 'true');
        player.play();
      }

      // Function: Pause Video
      function vimeoPlayerPause() {
        vimeoElement.setAttribute('data-vimeo-playing', 'false');
        player.pause();
      }

      // Store player instance in global object for external access
      window.vimeoPlayerInstances[videoIndexID] = {
        player: player,
        element: vimeoElement,
        pause: function () {
          vimeoPlayerPause();
          // Mark as paused by user to prevent auto-resume
          vimeoElement.setAttribute('data-vimeo-paused-by-user', 'true');
        },
        play: function () {
          vimeoPlayerPlay();
        },
      };

      // Update Aspect Ratio if [data-vimeo-update-size="true"]
      if (vimeoElement.getAttribute('data-vimeo-update-size') === 'true') {
        player.getVideoWidth().then(function (width) {
          player.getVideoHeight().then(function (height) {
            const beforeEl = vimeoElement.querySelector('.vimeo-player__before');
            if (beforeEl) {
              beforeEl.style.paddingTop = (height / width) * 100 + '%';
            }
          });
        });
      }

      // Loaded
      player.on('play', function () {
        vimeoElement.setAttribute('data-vimeo-loaded', 'true');
      });

      // Autoplay
      if (vimeoElement.getAttribute('data-vimeo-autoplay') === 'false') {
        // Autoplay = false
        player.setVolume(1);
        player.pause();
      } else {
        // Autoplay = true
        player.setVolume(0);
        vimeoElement.setAttribute('data-vimeo-muted', 'true');

        // If paused-by-user === false, do scroll-based autoplay
        if (vimeoElement.getAttribute('data-vimeo-paused-by-user') === 'false') {
          function checkVisibility() {
            const rect = vimeoElement.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            inView ? vimeoPlayerPlay() : vimeoPlayerPause();
          }

          // Initial check
          checkVisibility();

          // Handle scroll
          window.addEventListener('scroll', checkVisibility);
        }
      }

      // Click: Play
      const playBtn = vimeoElement.querySelector('[data-vimeo-control="play"]');
      if (playBtn) {
        playBtn.addEventListener('click', function () {
          // Always set volume to 0 first to avoid pop
          player.setVolume(0);
          vimeoPlayerPlay();

          // If muted attribute is 'true', keep volume at 0, else 1
          if (vimeoElement.getAttribute('data-vimeo-muted') === 'true') {
            player.setVolume(0);
          } else {
            player.setVolume(1);
          }
        });
      }

      // Click: Pause
      const pauseBtn = vimeoElement.querySelector('[data-vimeo-control="pause"]');
      if (pauseBtn) {
        pauseBtn.addEventListener('click', function () {
          vimeoPlayerPause();
          // If paused by user => kill the scroll-based autoplay
          if (vimeoElement.getAttribute('data-vimeo-autoplay') === 'true') {
            vimeoElement.setAttribute('data-vimeo-paused-by-user', 'true');
            // Removing scroll listener (if you'd like)
            window.removeEventListener('scroll', checkVisibility);
          }
        });
      }

      // Click: Mute
      const muteBtn = vimeoElement.querySelector('[data-vimeo-control="mute"]');
      if (muteBtn) {
        muteBtn.addEventListener('click', function () {
          if (vimeoElement.getAttribute('data-vimeo-muted') === 'false') {
            player.setVolume(0);
            vimeoElement.setAttribute('data-vimeo-muted', 'true');
          } else {
            player.setVolume(1);
            vimeoElement.setAttribute('data-vimeo-muted', 'false');
          }
        });
      }

      // Fullscreen
      // Check if Fullscreen API is supported
      const fullscreenSupported = !!(
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled
      );

      const fullscreenBtn = vimeoElement.querySelector('[data-vimeo-control="fullscreen"]');

      // Hide the fullscreen button if not supported
      if (!fullscreenSupported && fullscreenBtn) {
        fullscreenBtn.style.display = 'none';
      }

      if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
          const fullscreenElement = document.getElementById(iframeID);
          if (!fullscreenElement) return;

          const isFullscreen =
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;

          if (isFullscreen) {
            // Exit fullscreen
            vimeoElement.setAttribute('data-vimeo-fullscreen', 'false');
            (
              document.exitFullscreen ||
              document.webkitExitFullscreen ||
              document.mozCancelFullScreen ||
              document.msExitFullscreen
            ).call(document);
          } else {
            // Enter fullscreen
            vimeoElement.setAttribute('data-vimeo-fullscreen', 'true');
            (
              fullscreenElement.requestFullscreen ||
              fullscreenElement.webkitRequestFullscreen ||
              fullscreenElement.mozRequestFullScreen ||
              fullscreenElement.msRequestFullscreen
            ).call(fullscreenElement);
          }
        });
      }

      const handleFullscreenChange = () => {
        const isFullscreen =
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement;

        vimeoElement.setAttribute('data-vimeo-fullscreen', isFullscreen ? 'true' : 'false');
      };

      // Add event listeners for fullscreen changes (with vendor prefixes)
      [
        'fullscreenchange',
        'webkitfullscreenchange',
        'mozfullscreenchange',
        'msfullscreenchange',
      ].forEach((event) => {
        document.addEventListener(event, handleFullscreenChange);
      });

      // Convert seconds to mm:ss
      function secondsTimeSpanToHMS(s) {
        let h = Math.floor(s / 3600);
        s -= h * 3600;
        let m = Math.floor(s / 60);
        s -= m * 60;
        return m + ':' + (s < 10 ? '0' + s : s);
      }

      // Duration
      const vimeoDuration = vimeoElement.querySelector('[data-vimeo-duration]');
      player.getDuration().then(function (duration) {
        if (vimeoDuration) {
          vimeoDuration.textContent = secondsTimeSpanToHMS(duration);
        }
        // Update timeline + progress max
        const timelineAndProgress = vimeoElement.querySelectorAll(
          '[data-vimeo-control="timeline"], progress'
        );
        timelineAndProgress.forEach((el) => {
          el.setAttribute('max', duration);
        });
      });

      // Timeline
      const timelineElem = vimeoElement.querySelector('[data-vimeo-control="timeline"]');
      const progressElem = vimeoElement.querySelector('progress');

      function updateTimelineValue() {
        player.getDuration().then(function () {
          const timeVal = timelineElem.value;
          player.setCurrentTime(timeVal);
          if (progressElem) {
            progressElem.value = timeVal;
          }
        });
      }

      if (timelineElem) {
        ['input', 'change'].forEach((evt) => {
          timelineElem.addEventListener(evt, updateTimelineValue);
        });
      }

      // Progress Time & Timeline (timeupdate)
      player.on('timeupdate', function (data) {
        if (timelineElem) {
          timelineElem.value = data.seconds;
        }
        if (progressElem) {
          progressElem.value = data.seconds;
        }
        if (vimeoDuration) {
          vimeoDuration.textContent = secondsTimeSpanToHMS(Math.trunc(data.seconds));
        }
      });

      // Hide controls after hover on Vimeo player
      let vimeoHoverTimer;
      vimeoElement.addEventListener('mousemove', function () {
        if (vimeoElement.getAttribute('data-vimeo-hover') === 'false') {
          vimeoElement.setAttribute('data-vimeo-hover', 'true');
        }
        clearTimeout(vimeoHoverTimer);
        vimeoHoverTimer = setTimeout(vimeoHoverTrue, 3000);
      });

      function vimeoHoverTrue() {
        vimeoElement.setAttribute('data-vimeo-hover', 'false');
      }

      // Video Ended
      function vimeoOnEnd() {
        vimeoElement.setAttribute('data-vimeo-activated', 'false');
        vimeoElement.setAttribute('data-vimeo-playing', 'false');
        player.unload();
      }
      player.on('ended', vimeoOnEnd);
    });

    // Add this promise to our global array
    window.vimeoLoadPromises.push(loadPromise);
  });
}

// Create global function to pause any Vimeo player by ID
window.pauseVimeoPlayer = function (playerID) {
  if (window.vimeoPlayerInstances && window.vimeoPlayerInstances[playerID]) {
    window.vimeoPlayerInstances[playerID].pause();
    return true;
  }
  return false;
};

// Create global function to pause all Vimeo players
window.pauseAllVimeoPlayers = function () {
  if (window.vimeoPlayerInstances) {
    Object.keys(window.vimeoPlayerInstances).forEach(function (playerID) {
      window.vimeoPlayerInstances[playerID].pause();
    });
    return true;
  }
  return false;
};

// Create global function to check if all videos are preloaded
window.areVimeoVideosPreloaded = function () {
  if (window.vimeoLoadPromises && window.vimeoLoadPromises.length > 0) {
    return Promise.all(window.vimeoLoadPromises);
  }
  return Promise.resolve([]);
};

// Add jQuery method for Vimeo control
$.fn.pauseVimeo = function () {
  return this.each(function () {
    const id = $(this).attr('id');
    if (id && window.vimeoPlayerInstances[id]) {
      window.vimeoPlayerInstances[id].pause();
    }
  });
};
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

// #endregion

// #region Partner Slider
let partnerSlider = new Swiper('.hp_partner-bottom', {
  slidesPerView: 1,
  spaceBetween: 32,
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  threshold: 20,
});
// #endregion
