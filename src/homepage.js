import { initSwipers } from './utils/globalFunctions';

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
  const DEFAULT_DURATION = 18; // Fallback duration in seconds
  let hasBeenVisible = false; // Track if section has been visible

  if (!$('.ai-tabs_wrap').length) return;

  // Function to initialize swiper without autoplay initially
  const initSwiper = (videoDuration) => {
    // Use the video duration or default to 18 seconds
    const slideDuration = videoDuration || DEFAULT_DURATION;

    return new Swiper('.ai-tabs_slider', {
      slidesPerView: 'auto',
      spaceBetween: 8,
      autoplay: false, // Start with autoplay disabled
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
          // Don't animate progress initially
        },
        beforeSlideChange: () => {
          // Immediately kill all tweens of this element
          gsap.killTweensOf('.ai-tabs_progress-line');
          gsap.set('.ai-tabs_progress-line', { scaleX: 0 });
        },
        slideChange: (swiper) => {
          hightlightItem(swiper.realIndex);

          // Only manipulate videos if the section has been visible
          if (hasBeenVisible) {
            // Get current slide video duration if it exists
            const currentSlide = $(swiper.slides[swiper.activeIndex]);
            const video = currentSlide.find('video')[0];

            // Use video duration or default
            const currentDuration =
              video && video.duration && !isNaN(video.duration) ? video.duration : slideDuration;

            // Update autoplay delay dynamically
            swiper.params.autoplay.delay = currentDuration * 1000;

            // Force a new tween with current duration
            animateProgressBar(currentDuration);

            // If it's a video, ensure it's playing from the beginning
            if (video) {
              video.currentTime = 0;
              video.play().catch((e) => console.log('Video play error:', e));
            }
          }
        },
      },
    });
  };

  // Function to animate progress bar
  function animateProgressBar(duration) {
    gsap.fromTo(
      '.ai-tabs_progress-line',
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: duration,
        ease: 'none',
        immediateRender: true,
      }
    );
  }

  // Initialize Swiper immediately on page load, but without autoplay
  swiperTabs = initSwiper(DEFAULT_DURATION);

  // Function to start the tabs when scrolled into view
  function startTabsWithVideo() {
    if (hasBeenVisible) return; // Only run once

    hasBeenVisible = true;
    console.log('Tab section now visible, starting tabs');

    // Ensure we're on the first slide (with loop mode handling)
    swiperTabs.slideToLoop(0, 0);

    // Get the active slide's video after ensuring we're on the correct slide
    const activeSlide = $(swiperTabs.slides[swiperTabs.activeIndex]);
    const firstSlideVideo = activeSlide.find('video')[0];

    // Set up video and autoplay
    let duration = DEFAULT_DURATION;

    if (firstSlideVideo) {
      // Make sure all other videos are paused
      $('.ai-tabs_slider .swiper-slide video').each(function () {
        if (this !== firstSlideVideo) {
          this.pause();
          this.currentTime = 0;
        }
      });

      // Reset and prepare video
      firstSlideVideo.currentTime = 0;
      firstSlideVideo.muted = true; // Mute to avoid autoplay restrictions

      // Play the video now that we've scrolled to it
      const playPromise = firstSlideVideo.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Get duration once video is actually playing
            duration =
              firstSlideVideo.duration && !isNaN(firstSlideVideo.duration)
                ? firstSlideVideo.duration
                : DEFAULT_DURATION;

            // Set up autoplay with the correct duration
            swiperTabs.params.autoplay = {
              delay: duration * 1000,
              disableOnInteraction: false,
            };

            // Start the autoplay with the proper timing
            swiperTabs.autoplay.start();

            // Start the progress animation
            animateProgressBar(duration);
          })
          .catch((e) => {
            console.log('Video play error:', e);
            startWithDefault();
          });
      } else {
        startWithDefault();
      }
    } else {
      startWithDefault();
    }

    // Helper for starting with default duration
    function startWithDefault() {
      duration = DEFAULT_DURATION;
      swiperTabs.params.autoplay = {
        delay: duration * 1000,
        disableOnInteraction: false,
      };
      swiperTabs.autoplay.start();
      animateProgressBar(duration);
    }
  }

  // Initialize the observer to detect when tab section is visible
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('Tab section is now visible');
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            // Start everything when section becomes visible
            startTabsWithVideo();
          }, 100);
          observer.disconnect(); // Stop observing after initialization
        }
      });
    },
    { threshold: 1 } // Lower threshold for easier triggering
  );

  observer.observe(document.querySelector('.ai-tabs_wrap'));

  // Handle tab clicks
  $('.ai-tabs_pane-item').on('click', function () {
    if (!swiperTabs) return; // Safety check

    var index = $('.ai-tabs_pane-item').index(this);
    swiperTabs.slideToLoop(index);

    // If we haven't started yet (clicked before scrolling into view)
    if (!hasBeenVisible) {
      startTabsWithVideo();
    }
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
    navigation: {
      prevEl: `.swiper-arrow.prev.is-customer`,
      nextEl: `.swiper-arrow.next.is-customer`,
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
      480: {
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
        if (window.innerWidth <= 479) {
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
    if (customerSwiper && window.innerWidth > 479) {
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
  window.vimeoPlayerInstances = {};
  window.vimeoLoadPromises = [];
  window.vimeoPreloadedVideos = {};

  // Stagger the initialization to prevent too many videos loading simultaneously
  function staggeredInitialization(videos, index) {
    if (index >= videos.length) return;

    const vimeoElement = videos[index];
    const vimeoVideoID = vimeoElement.getAttribute('data-vimeo-video-id');

    if (vimeoVideoID) {
      initSingleVimeoPlayer(vimeoElement, index);
    }

    // Process next video with a small delay
    setTimeout(() => {
      staggeredInitialization(videos, index + 1);
    }, 200);
  }

  function initSingleVimeoPlayer(vimeoElement, index) {
    const vimeoVideoID = vimeoElement.getAttribute('data-vimeo-video-id');
    if (!vimeoVideoID) return;

    const videoIndexID = 'vimeo-player-index-' + index;
    vimeoElement.setAttribute('id', videoIndexID);

    // Set up iframe src immediately
    const vimeoVideoURL = `https://player.vimeo.com/video/${vimeoVideoID}?api=1&background=0&controls=0&autoplay=0&loop=0&muted=1&quality=auto&preload=auto`;
    const iframe = vimeoElement.querySelector('iframe');
    iframe.setAttribute('src', vimeoVideoURL);
    iframe.setAttribute('allow', 'autoplay; fullscreen');

    // Set default state as muted
    vimeoElement.setAttribute('data-vimeo-muted', 'true');

    // Create a promise that resolves when video is preloaded
    const loadPromise = new Promise((resolve) => {
      // Track when iframe is fully loaded before creating the player
      iframe.onload = function () {
        try {
          // Initialize the player with the iframe element directly
          const player = new Vimeo.Player(iframe);

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

          // Helper function to post messages to Vimeo iframe
          function postToVimeo(action, value) {
            const data = { method: action };
            if (value !== undefined) {
              data.value = value;
            }
            iframe.contentWindow.postMessage(data, '*');
          }

          // Function to handle iframe messages for preloading
          function handleVimeoMessages(e) {
            // Verify origin for security
            if (!/^https?:\/\/player.vimeo.com/.test(e.origin)) {
              return false;
            }

            try {
              const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;

              if (data.event === 'ready') {
                // When player is ready, ensure it's muted before preloading
                postToVimeo('setVolume', 0);
                // Start preloading by playing briefly
                postToVimeo('play');
              } else if (
                data.event === 'playProgress' &&
                !window.vimeoPreloadedVideos[videoIndexID]
              ) {
                // Once playback starts, immediately pause it - video is now preloaded
                window.vimeoPreloadedVideos[videoIndexID] = true;
                postToVimeo('pause');
                vimeoElement.setAttribute('data-vimeo-preloaded', 'true');
                resolve(); // Resolve the promise when preloaded
              }
            } catch (err) {
              console.warn('Error handling Vimeo message', err);
            }
          }

          // Listen for messages from the Vimeo iframe
          if (window.addEventListener) {
            window.addEventListener('message', handleVimeoMessages, false);
          } else {
            window.attachEvent('onmessage', handleVimeoMessages, false);
          }

          // Store player instance in global object for external access
          window.vimeoPlayerInstances[videoIndexID] = {
            player: player,
            element: vimeoElement,
            iframe: iframe,
            postMessage: postToVimeo,
            pause: function () {
              vimeoPlayerPause();
              vimeoElement.setAttribute('data-vimeo-paused-by-user', 'true');
            },
            play: function () {
              vimeoPlayerPlay();
            },
          };

          // Ensure player is muted for preloading
          player.on('loaded', function () {
            postToVimeo('addEventListener', 'playProgress');
            player.setVolume(0);
          });

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
            player.setVolume(1);
          } else {
            player.setVolume(0);
            vimeoElement.setAttribute('data-vimeo-muted', 'true');

            // If paused-by-user === false, do scroll-based autoplay
            if (vimeoElement.getAttribute('data-vimeo-paused-by-user') === 'false') {
              function checkVisibility() {
                const rect = vimeoElement.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                if (inView && window.vimeoPreloadedVideos[videoIndexID]) {
                  vimeoPlayerPlay();
                } else {
                  vimeoPlayerPause();
                }
              }

              // Check visibility after preloading is complete
              const checkPreloadInterval = setInterval(function () {
                if (window.vimeoPreloadedVideos[videoIndexID]) {
                  checkVisibility();
                  window.addEventListener('scroll', checkVisibility);
                  clearInterval(checkPreloadInterval);
                }
              }, 500);
            }
          }

          // Click: Play
          const playBtn = vimeoElement.querySelector('[data-vimeo-control="play"]');
          if (playBtn) {
            playBtn.addEventListener('click', function () {
              // Unmute the video when user clicks play
              player.setVolume(1);
              vimeoElement.setAttribute('data-vimeo-muted', 'false');
              vimeoPlayerPlay();
            });
          }

          // Click: Pause
          const pauseBtn = vimeoElement.querySelector('[data-vimeo-control="pause"]');
          if (pauseBtn) {
            pauseBtn.addEventListener('click', function () {
              vimeoPlayerPause();
              if (vimeoElement.getAttribute('data-vimeo-autoplay') === 'true') {
                vimeoElement.setAttribute('data-vimeo-paused-by-user', 'true');
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
          const fullscreenSupported = !!(
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled
          );

          const fullscreenBtn = vimeoElement.querySelector('[data-vimeo-control="fullscreen"]');

          if (!fullscreenSupported && fullscreenBtn) {
            fullscreenBtn.style.display = 'none';
          }

          if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
              const fullscreenElement = document.getElementById(videoIndexID);
              if (!fullscreenElement) return;

              const isFullscreen =
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement;

              if (isFullscreen) {
                vimeoElement.setAttribute('data-vimeo-fullscreen', 'false');
                (
                  document.exitFullscreen ||
                  document.webkitExitFullscreen ||
                  document.mozCancelFullScreen ||
                  document.msExitFullscreen
                ).call(document);
              } else {
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
        } catch (err) {
          console.warn('Error initializing Vimeo player:', err);
          resolve(); // Still resolve the promise even if there's an error
        }
      };

      // Fail-safe in case iframe load event doesn't fire
      setTimeout(resolve, 8000);
    });

    window.vimeoLoadPromises.push(loadPromise);
  }

  // Start the staggered initialization
  const vimeoPlayers = document.querySelectorAll('[data-vimeo-player-init]');
  staggeredInitialization(vimeoPlayers, 0);
}

// jQuery document ready initialization
$(document).ready(function () {
  if (typeof Vimeo !== 'undefined') {
    initVimeoPlayer();
  } else {
    console.warn('Vimeo Player API not found. Make sure to include the Vimeo Player API script.');
  }
});

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

function animateProgressBar(parent, duration) {
  gsap.fromTo(
    $(parent).find('.slider-progress_bg'),
    { width: '0%' },
    { width: '100%', duration: duration / 1000 }
  );
}

// Sample data for swiperInstances, specific to this page
const swiperInstances = [
  [
    '.section_hp-slider',
    '.swiper-cs',
    'cs-slider',
    {
      slidesPerView: 'auto',
      loop: true,
      speed: 1000,
      centeredSlides: false,
      autoplay: { delay: 3000 },
      spaceBetween: 20,
      on: {
        init: (swiper) => {
          animateProgressBar('.section_hp-slider', 5000);
        },
        slideChange: (swiper) => {
          animateProgressBar('.section_hp-slider', 5000);
        },
      },
    },
    'all',
  ],
  [
    '.slider-wrapper',
    '.swiper-news',
    'news-slider',
    {
      slidesPerView: 'auto',
      effect: 'fade',
      pagination: {
        el: '.swiper-nav.is-news',
        type: 'fraction',
      },
    },
    'all',
  ],
  [
    '.section_hp-resources',
    '.blog_collection-wrap',
    'resources',
    {
      slidesPerView: 'auto',
      spaceBetween: 24,
      pagination: {
        el: '.hp-resources_nav',
        type: 'bullets',
        bulletActiveClass: 'cc-active',
        bulletClass: 'slider-dot',
        clickable: true,
      },
    },
    'mobile',
  ],
];

// Initialize swipers with instances specific to this page
initSwipers(swiperInstances);
