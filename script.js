const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const profilePhoto = document.querySelector('.profile-photo');
let dialogTrigger = null;

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  siteNav?.classList.toggle('open');
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Keep a useful placeholder visible until assets/images/profile.jpg is added.
if (profilePhoto) {
  const markProfileMissing = () => profilePhoto.closest('.profile-frame')?.classList.add('image-missing');
  profilePhoto.addEventListener('error', markProfileMissing);
  if (profilePhoto.complete && profilePhoto.naturalWidth === 0) markProfileMissing();
}

function openProject(dialog, trigger) {
  if (!dialog || dialog.open) return;
  dialogTrigger = trigger;
  document.body.classList.add('dialog-open');
  dialog.showModal();
  dialog.querySelector('.dialog-shell')?.scrollTo({ top: 0 });
}

document.querySelectorAll('[data-dialog]').forEach((card) => {
  const openCard = () => openProject(document.getElementById(card.dataset.dialog), card);
  card.addEventListener('click', openCard);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCard();
    }
  });
});

document.querySelectorAll('[data-experience-tile]').forEach((tile) => {
  const toggleTile = () => {
    const expanded = tile.getAttribute('aria-expanded') === 'true';
    tile.setAttribute('aria-expanded', String(!expanded));
    tile.classList.toggle('is-expanded', !expanded);
    const detail = tile.querySelector('.experience-expanded');
    if (detail) detail.hidden = expanded;
  };

  tile.addEventListener('click', toggleTile);
  tile.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleTile();
    }
  });
});

document.querySelectorAll('dialog.project-dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  // Native dialogs close on Escape. The close event restores the page state
  // for every close path, including the button, backdrop, and keyboard.
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    dialogTrigger?.focus({ preventScroll: true });
    dialogTrigger = null;
  });
});

// ============================================================
// PORTFOLIO IMAGE CONFIGURATION
// PNG, JPG, JPEG and WEBP files are supported (extension case does not matter).
// Project folders already in this project are retained: uav, zoom-controller,
// quadcopter, motor-driver, and nabik.
// `main` maps to that project's card and main detail view. `gallery` maps to
// that project's labeled subsection/gallery slots in order. Leave a path empty
// to keep its existing placeholder visible.
// Add gallery files to the matching folder and add their path + useful alt text.
// ============================================================
const portfolioImages = {
  projects: {
    uav: { main: { src: 'assets/images/uav/gallery-01.jpg', alt: 'Fixed-wing surveillance UAV' }, gallery: [] },
    zoomController: { main: { src: '', alt: 'Motorized zoom and focus controller' }, gallery: [] },
    quadcopter: { main: { src: '', alt: 'Custom quadcopter flight controller' }, gallery: [] },
    motorDriver: { main: { src: '', alt: 'MOSFET motor driver printed circuit board' }, gallery: [] },
    nabik: { main: { src: '', alt: 'Nabik emergency relief robot' }, gallery: [] },
  },
  // Put files in assets/images/achievements/ and register one { src, alt } entry.
  // Recommended achievement image dimensions: 1200 × 800 px (3:2).
  achievements: [
    // { src: 'assets/images/achievements/achievement-01.png', alt: 'Robotics competition award certificate' },
    { src: 'assets/images/achievements/achievement-01.png', alt: 'Robotics competition award certificate' },
    { src: 'assets/images/achievements/achievement-02.png', alt: 'Robotics competition award certificate' },
    { src: 'assets/images/achievements/achievement-03.png', alt: 'Robotics competition award certificate' },
  ],
};

const supportedImageExtension = /\.(png|jpe?g|webp)$/i;

function configureImage(img, { src, alt }, onFailure) {
  if (!src || !supportedImageExtension.test(src)) {
    console.error(`[Portfolio images] Unsupported or empty image path: ${src || '(empty path)'}`);
    onFailure?.();
    return false;
  }
  img.alt = alt || 'Portfolio project image';
  img.addEventListener('error', () => {
    console.error(`[Portfolio images] Could not load: ${src}`);
    onFailure?.();
  }, { once: true });
  img.src = src;
  return true;
}

function mountConfiguredProjectImages() {
  const dialogProjects = {
    'uav-dialog': 'uav',
    'zoom-dialog': 'zoomController',
    'quad-dialog': 'quadcopter',
    'pcb-dialog': 'motorDriver',
    'nabik-dialog': 'nabik',
  };
  Object.entries(dialogProjects).forEach(([dialogId, projectId]) => {
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;
    dialog.dataset.projectId = projectId;
    const mainSlot = dialog.querySelector('.media-placeholder.media-wide');
    if (mainSlot) mainSlot.dataset.projectImage = `${projectId}:main`;

    // The configured gallery belongs to this gallery section inside the dialog.
    // Keep the section out of view when no additional gallery images are mapped.
    const gallery = portfolioImages.projects[projectId]?.gallery || [];
    const gallerySection = dialog.querySelector('.media-gallery')?.closest('.detail-section');
    const galleryGrid = dialog.querySelector('.media-gallery');
    if (gallerySection && galleryGrid) {
      gallerySection.hidden = gallery.length === 0;
      const existingSlots = [...galleryGrid.querySelectorAll('.media-placeholder')];
      gallery.forEach((image, index) => {
        let slot = existingSlots[index];
        if (!slot) {
          slot = document.createElement('div');
          slot.className = 'media-placeholder';
          galleryGrid.append(slot);
        }
        slot.dataset.projectImage = `${projectId}:gallery:${index}`;
      });
      existingSlots.slice(gallery.length).forEach((slot) => slot.remove());
    }
    const card = document.querySelector(`[data-dialog="${dialogId}"]`);
    if (card) card.dataset.projectMainCard = projectId;
  });

  document.querySelectorAll('[data-project-image]').forEach((slot) => {
    const [projectId, imageType, imageIndex] = slot.dataset.projectImage.split(':');
    const project = portfolioImages.projects[projectId];
    const image = imageType === 'main' ? project?.main : project?.gallery?.[Number(imageIndex)];
    if (!image?.src) return;

    const img = document.createElement('img');
    const placeholderContent = slot.innerHTML;
    if (configureImage(img, image, () => {
      slot.classList.remove('has-image');
      slot.innerHTML = placeholderContent;
    })) {
      slot.replaceChildren(img);
      slot.classList.add('has-image');
      slot.setAttribute('aria-label', image.alt || 'Project image');
    }
  });

  document.querySelectorAll('[data-project-main-card]').forEach((card) => {
    const image = portfolioImages.projects[card.dataset.projectMainCard]?.main;
    if (!image?.src) return;
    const img = document.createElement('img');
    img.className = 'project-card-image';
    if (configureImage(img, image, () => img.remove())) card.prepend(img);
  });
}

// Center-focused achievement carousel. Add one { src, alt } entry above for each image.
let currentAchievementIndex = 0;
let isAchievementPaused = false;
let achievementAutoplayTimer = null;
let achievementCards = [];
const achievementCarousel = document.querySelector('.achievement-carousel');
const achievementTrack = document.getElementById('achievement-track');
const achievementStatus = document.getElementById('achievement-status');
const achievementMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateAchievementCarousel(announce = false) {
  if (!achievementCarousel || !achievementTrack) return;
  const count = achievementCards.length;
  achievementCarousel.classList.toggle('has-images', count > 0);
  if (!count) {
    achievementCarousel.classList.remove('is-single');
    if (achievementStatus) achievementStatus.textContent = 'No achievement images are currently available.';
    return;
  }

  achievementCarousel.classList.toggle('is-single', count === 1);
  const viewportWidth = achievementCarousel.clientWidth;
  const cardWidth = achievementCards[0]?.getBoundingClientRect().width || Math.min(350, viewportWidth * (window.innerWidth <= 720 ? 0.78 : 0.31));
  const visibleRadius = viewportWidth <= 900 ? 1 : 2;
  const step = visibleRadius === 1
    ? cardWidth * 0.79
    : Math.min(cardWidth * 0.68, viewportWidth / 4 - cardWidth * 0.19);
  achievementCards.forEach((card, index) => {
    let relative = (index - currentAchievementIndex + count) % count;
    if (relative > count / 2) relative -= count;
    // With two cards, keep the other slide consistently to the right.
    const distance = Math.abs(relative);
    const visible = distance <= visibleRadius;
    const scale = [1.04, 0.88, 0.75][Math.min(distance, 2)];
    card.classList.toggle('active', index === currentAchievementIndex);
    card.setAttribute('aria-pressed', String(index === currentAchievementIndex));
    card.style.transform = `translate(-50%, -50%) translateX(${relative * step}px) scale(${scale})`;
    card.style.opacity = visible ? String([1, 0.82, 0.54][Math.min(distance, 2)]) : '0';
    card.style.zIndex = String(10 - distance);
    card.style.pointerEvents = visible ? 'auto' : 'none';
    card.tabIndex = visible ? 0 : -1;
    card.setAttribute('aria-hidden', String(!visible));
  });
  if (announce && achievementStatus) achievementStatus.textContent = `Achievement ${currentAchievementIndex + 1} of ${count}: ${portfolioImages.achievements[achievementCards[currentAchievementIndex].dataset.imageIndex]?.alt || 'Achievement'}`;
}

function goToAchievement(index, announce = true) {
  const count = achievementCards.length;
  if (!count) return;
  currentAchievementIndex = (index + count) % count;
  updateAchievementCarousel(announce);
}
function nextAchievement() { goToAchievement(currentAchievementIndex + 1); }
function previousAchievement() { goToAchievement(currentAchievementIndex - 1); }
function stopAchievementAutoplay() {
  window.clearInterval(achievementAutoplayTimer);
  achievementAutoplayTimer = null;
}
function startAchievementAutoplay() {
  stopAchievementAutoplay();
  if (achievementCards.length > 1 && !isAchievementPaused && !achievementMotionPreference.matches) {
    // One slide per 3.6s; CSS handles the 850ms slide transition.
    achievementAutoplayTimer = window.setInterval(nextAchievement, 3600);
  }
}

function createAchievementCard(image, imageIndex) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'achievement-card';
  card.dataset.imageIndex = String(imageIndex);
  card.setAttribute('aria-label', image.alt || `Achievement ${imageIndex + 1}`);
  card.setAttribute('aria-pressed', 'false');
  const img = document.createElement('img');
  img.loading = 'lazy';
  img.alt = '';
  card.append(img);
  if (!configureImage(img, image, () => {
    const removedIndex = achievementCards.indexOf(card);
    if (removedIndex === -1) return;
    card.remove();
    achievementCards.splice(removedIndex, 1);
    portfolioImages.achievements.splice(Number(card.dataset.imageIndex), 1);
    achievementCards.forEach((remainingCard, index) => { remainingCard.dataset.imageIndex = String(index); });
    currentAchievementIndex = achievementCards.length ? Math.min(currentAchievementIndex, achievementCards.length - 1) : 0;
    updateAchievementCarousel();
    startAchievementAutoplay();
  })) return null;
  card.addEventListener('click', (event) => {
    event.stopPropagation();
    isAchievementPaused = true;
    stopAchievementAutoplay();
    goToAchievement(Number(card.dataset.imageIndex));
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); goToAchievement(currentAchievementIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goToAchievement(currentAchievementIndex - 1); }
  });
  return card;
}

function initializeAchievementCarousel() {
  if (!achievementCarousel || !achievementTrack) return;
  portfolioImages.achievements.forEach((image, index) => {
    const card = createAchievementCard(image, index);
    if (card) { achievementCards.push(card); achievementTrack.append(card); }
  });
  updateAchievementCarousel();
  achievementCarousel.addEventListener('keydown', (event) => {
    if (event.target !== achievementCarousel) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); goToAchievement(currentAchievementIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goToAchievement(currentAchievementIndex - 1); }
  });
  achievementCarousel.addEventListener('pointerenter', () => { isAchievementPaused = true; stopAchievementAutoplay(); });
  achievementCarousel.addEventListener('pointerleave', () => {
    if (!achievementCarousel.contains(document.activeElement) && !achievementCarousel.querySelector('.active:focus')) {
      isAchievementPaused = false;
      startAchievementAutoplay();
    }
  });
  achievementCarousel.addEventListener('focusin', () => { isAchievementPaused = true; stopAchievementAutoplay(); });
  achievementCarousel.addEventListener('focusout', (event) => {
    if (!achievementCarousel.contains(event.relatedTarget)) {
      isAchievementPaused = false;
      startAchievementAutoplay();
    }
  });
  document.addEventListener('click', (event) => {
    if (isAchievementPaused && !achievementCarousel.contains(event.target)) {
      isAchievementPaused = false;
      startAchievementAutoplay();
    }
  });
  let touchStartX = null;
  achievementCarousel.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0]?.clientX ?? null; }, { passive: true });
  achievementCarousel.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) < 42) return;
    isAchievementPaused = true;
    stopAchievementAutoplay();
    delta < 0 ? nextAchievement() : previousAchievement();
  }, { passive: true });
  window.addEventListener('resize', () => updateAchievementCarousel());
  achievementMotionPreference.addEventListener?.('change', () => {
    if (achievementMotionPreference.matches) stopAchievementAutoplay();
    else startAchievementAutoplay();
  });
  startAchievementAutoplay();
}

initializeAchievementCarousel();
mountConfiguredProjectImages();

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
