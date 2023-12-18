// --- Video Modal
const videoModal = document.querySelector('.video-modal-wrap');
const video = videoModal.querySelector('video');
document.querySelectorAll('[data-toggle="video"]').forEach((trigger) => {
  trigger.addEventListener('click', function () {
    console.log('click');
    videoModal.style.display = 'flex';
    video.load();
    var playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then((_) => {}).catch((error) => {});
    }
  });
});
document.querySelectorAll('[data-toggle="close-video"]').forEach((trigger) => {
  trigger.addEventListener('click', function () {
    videoModal.style.display = 'none';
    video.pause();
    video.currentTime = 0;
  });
});

// --- Nav Open/Close
let ham = 'nav_burger';
let menuOpen = false;
let scrollPosition;
$(ham).on('click', function () {
  disableScroll();
});

const disableScroll = () => {
  if (!menuOpenAnim) {
    scrollPosition = $(window).scrollTop();
    console.log(scrollPosition);
    $('html, body').scrollTop(0).addClass('overflow-hidden');
  } else {
    $('html, body').scrollTop(scrollPosition).removeClass('overflow-hidden');
  }
  menuOpenAnim = !menuOpenAnim;
  console.log(menuOpenAnim);
};
