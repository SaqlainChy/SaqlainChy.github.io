const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const profilePhoto = document.querySelector('.profile-photo');
const imageLightbox = document.getElementById('image-lightbox');
const imageLightboxPhoto = document.getElementById('image-lightbox-image');
const imageLightboxCaption = document.getElementById('image-lightbox-caption');
let dialogTrigger = null;
let imageLightboxTrigger = null;
let imageLightboxSourceImage = null;
let imageLightboxScrollY = 0;
let imageLightboxCloseTimer = null;

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

function getLightboxReturnTarget(image) {
  return image.closest('.achievement-card, .design-showcase-card, .project-card[role="button"]') || image;
}

function openImageLightbox(image) {
  if (!imageLightbox || !imageLightboxPhoto || !image || imageLightbox.open) return;
  const originalSrc = image.dataset.lightboxSrc || image.currentSrc || image.src;
  if (!originalSrc) return;

  imageLightboxTrigger = getLightboxReturnTarget(image);
  imageLightboxSourceImage = image;
  imageLightboxScrollY = window.scrollY;
  imageLightboxPhoto.src = originalSrc;
  imageLightboxPhoto.alt = image.alt || image.getAttribute('aria-label') || image.closest('.achievement-card, .design-showcase-card')?.getAttribute('aria-label') || 'Full-size portfolio image';
  if (imageLightboxCaption) imageLightboxCaption.textContent = imageLightboxPhoto.alt;
  document.body.classList.add('lightbox-open');
  imageLightbox.showModal();
  requestAnimationFrame(() => imageLightbox.classList.add('is-visible'));
}

function finishClosingImageLightbox() {
  if (!imageLightbox?.open) return;
  window.clearTimeout(imageLightboxCloseTimer);
  imageLightboxCloseTimer = null;
  imageLightbox.close();
}

function closeImageLightbox() {
  if (!imageLightbox?.open || imageLightbox.classList.contains('is-closing')) return;
  imageLightbox.classList.remove('is-visible');
  imageLightbox.classList.add('is-closing');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishClosingImageLightbox();
    return;
  }
  imageLightboxCloseTimer = window.setTimeout(finishClosingImageLightbox, 180);
}

if (imageLightbox) {
  imageLightboxPhoto?.addEventListener('error', () => {
    const fallbackSrc = imageLightboxSourceImage?.currentSrc || imageLightboxSourceImage?.src;
    if (fallbackSrc && imageLightboxPhoto.src !== fallbackSrc) {
      imageLightboxPhoto.src = fallbackSrc;
      return;
    }
    imageLightboxPhoto?.removeAttribute('src');
    if (imageLightboxCaption) imageLightboxCaption.textContent = 'This image could not be loaded.';
    if (imageLightboxPhoto) imageLightboxPhoto.alt = 'Image unavailable';
  });
  imageLightbox.querySelector('.image-lightbox-close')?.addEventListener('click', closeImageLightbox);
  imageLightbox.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeImageLightbox();
  });
  imageLightbox.addEventListener('click', (event) => {
    if (event.target === imageLightbox) closeImageLightbox();
  });
  imageLightbox.addEventListener('close', () => {
    imageLightbox.classList.remove('is-closing', 'is-visible');
    document.body.classList.remove('lightbox-open');
    imageLightboxPhoto?.removeAttribute('src');
    if (imageLightboxTrigger?.isConnected) imageLightboxTrigger.focus({ preventScroll: true });
    window.scrollTo({ top: imageLightboxScrollY, behavior: 'instant' });
    imageLightboxTrigger = null;
    imageLightboxSourceImage = null;
  });

  // Project overview cards own their click; only images outside them open the viewer.
  // Images inside project dialogs and focused carousel cards retain their existing behavior.
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest('#image-lightbox')) return;
    const designCard = target.closest('.design-showcase-card');
    const achievementCard = target.closest('.achievement-card');
    const carouselCard = designCard || achievementCard;
    let image = target.closest('img.lightbox-trigger');
    if (!image) {
      if (designCard || (achievementCard && target === achievementCard)) {
        image = carouselCard.querySelector('img.lightbox-trigger');
      }
    }
    if (!image) return;
    if (image.closest('.project-card')) return;
    // A side carousel image first becomes active; only a later click opens it.
    if (carouselCard && !carouselCard.classList.contains('active')) return;
    openImageLightbox(image);
  }, true);

  document.addEventListener('keydown', (event) => {
    const image = event.target instanceof Element ? event.target.closest('img.lightbox-trigger') : null;
    if (!image || image.closest('.achievement-card, .design-showcase-card, .project-card')) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openImageLightbox(image);
    }
  });
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
// `main` supplies the project-card thumbnail and featured detail image.
// Subsection arrays map to data-project-image-slot markers in index.html.
// Keep an array empty to retain its original placeholder frames.
// ============================================================
const portfolioImages = {
  projects: {
    uav: {
      main: { src: 'assets/images/uav/gallery-01.jpg', alt: 'Fixed-wing surveillance UAV' },
      gallery: [{ src: 'assets/images/uav/gallery-02.png', alt: 'UAV pressure simulation showing airflow traces around the wing' },
    { src: 'assets/images/uav/gallery-03.png', alt: 'Fixed-wing UAV pressure simulation from an oblique view' },
    { src: 'assets/images/uav/gallery-04.png', alt: 'Fixed-wing UAV pressure simulation from above' },
    { src: 'assets/images/uav/gallery-05.jpg', alt: '3D printed Fuselage before assembly'},
    { src: 'assets/images/uav/gallery-06.jpg', alt: 'During Assembly' },
    { src: 'assets/images/uav/gallery-07.jpg', alt: 'After 2nd Coat of Color' },],
      cad: [{
      src: 'assets/images/uav/cad-01.png',
      alt: 'UAV CAD drawing',
    },
    {
      src: 'assets/images/uav/cad-02.png',
      alt: 'UAV CAD drawing',
    },
    {
      src: 'assets/images/uav/cad-03.png',
      alt: 'UAV CAD fuselage',
    },
    {
      src: 'assets/images/uav/cad-04.png',
      alt: 'UAV CAD wing profile',
    },
    {
      src: 'assets/images/uav/cad-05.png',
      alt: 'UAV CAD Design',
    },
    {
      src: 'assets/images/uav/cad-06.png',
      alt: 'UAV CAD design',
    },],
      electronics: [{
      src: 'assets/images/uav/elec-01.png',
      alt: 'UAV Electrical system',
    },],
      videos: [],
    },
    zoomController: {
      main: { src: 'assets/images/zoom-controller/main.png', alt: 'Custom Zoom controller for PI-Cam' },
      gallery: [],
      electronics: [{
      src: 'assets/images/zoom-controller/drawing.jpg',
      alt: 'CAD Drawing',
      },
      {
      src: 'assets/images/zoom-controller/gallery-01.png',
      alt: '3D design with cover',
    },],
      mechanical: [{
      src: 'assets/images/zoom-controller/gallery-02.png',
      alt: '3D design w/o cover',
    },
    {
      src: 'assets/images/zoom-controller/gallery-03.png',
      alt: '3D design w/o cover',
    },{
      src: 'assets/images/zoom-controller/gallery-04.png',
      alt: '3D design w/o cover',
    },{
      src: 'assets/images/zoom-controller/1.jpeg',
      alt: 'After Assembling',
    },
    {
      src: 'assets/images/zoom-controller/2.jpeg',
      alt: 'After Assembling',
    },
    {
      src: 'assets/images/zoom-controller/3.jpeg',
      alt: 'After Assembling',
    },
    {
      src: 'assets/images/zoom-controller/4.jpg',
      alt: 'After Assembling',
    },
    {
      src: 'assets/images/zoom-controller/schematic.png',
      alt: 'Schematic',
    },],
      videos: [],
    },
    quadcopter: {
      main: { src: 'assets/images/quadcopter/main.png', alt: 'Custom Drone' },
      gallery: [],
      electronics: [
        {
      src: 'assets/images/quadcopter/drawing.png',
      alt: '3d Drawing',
        },
        {
      src: 'assets/images/quadcopter/cad model.png',
      alt: 'CAD Model',
        },
        {
      src: 'assets/images/quadcopter/3.jpeg',
      alt: 'During Assembly',
        },
        {
      src: 'assets/images/quadcopter/4.jpeg',
      alt: 'During Assembly',
        },
        {
      src: 'assets/images/quadcopter/6.jpg',
      alt: 'During Assembly',
        },

      ],
      wiring: [
        {
      src: 'assets/images/quadcopter/7.jpg',
      alt: 'During Assembly',
        },
      ],
      videos: [],
    },
    motorDriver: {
      main: { src: 'assets/images/quadcopter/5.jpeg', alt: 'MOSFET motor driver printed circuit board' },
      gallery: [],
      schematic: [
        {
      src: 'assets/images/quadcopter/driver.png',
      alt: 'During Assembly',
        },

      ],
      pcb: [
        {
      src: 'assets/images/motor-driver/1.jpg',
      alt: 'PCB prototype',
        },
      ],
      videos: [],
    },
    nabik: {
      main: { src: 'assets/images/nabik/main.png', alt: 'Nabik emergency relief robot' },
      gallery: [
        {
      src: 'assets/images/nabik/1.png',
      alt: 'Prototype',
        },
        {
      src: 'assets/images/nabik/2.png',
      alt: 'Prototype',
        },
        {
      src: 'assets/images/nabik/3.png',
      alt: 'Prototype',
        },
        {
      src: 'assets/images/nabik/4.png',
      alt: 'Prototype',
        },
        {
      src: 'assets/images/nabik/5.png',
      alt: 'Prototype',
        },
        {
      src: 'assets/images/nabik/6.png',
      alt: 'Prototype',
        },
        {
      src: 'assets/images/nabik/proa1.png',
      alt: 'Proa Inspired Design',
        },
        {
      src: 'assets/images/nabik/thruster.png',
      alt: 'Thruster Prototype',
        },
      ],
      cad: [
         {
      src: 'assets/images/nabik/11.png',
      alt: 'Sketch',
        },

      ],
      electronics: [
        {
      src: 'assets/images/nabik/12.png',
      alt: 'Prototype',
        },
      ],
      videos: [],
    },
  },
  // Put files in assets/images/achievements/ and register one { src, alt } entry.
  // Recommended achievement image dimensions: 1200 × 800 px (3:2).
  achievements: [
    {
      src: 'assets/images/achievements/1.png',
      alt: 'https://www.facebook.com/share/v/1CheNQh3HM/',
      },
      {
      src: 'assets/images/achievements/2.png',
      alt: 'https://www.youtube.com/watch?v=qBWtcgIuvng',
      },
      {
      src: 'assets/images/achievements/3.png',
      alt: 'https://www.thedailystar.net/tech-startup/news/bracu-students-develop-nabik-robot-flood-relief-3689561',
      },
      {
      src: 'assets/images/achievements/4.png',
      alt: 'https://www.dhakatribune.com/bangladesh/356909/rover-%E2%80%98nabik%E2%80%99-prepares-for-second-deployment-in',
      },
      {
      src: 'assets/images/achievements/5.jpg',
      alt: '',
      },
  ],
  // Put smaller CAD/design showcase images in assets/images/3d-designs/.
  // Recommended image dimensions: 1200 × 800 px (3:2 landscape).
  designShowcase: [
    {
      src: 'assets/images/3d-designs/pixieb.png',
      alt: 'Base For Pixie Bot',
      },
    {
      src: 'assets/images/3d-designs/pixiet.png',
      alt: 'Connector For Pixie Bot',
      },
    {
      src: 'assets/images/3d-designs/helo-rotor.png',
      alt: 'Conceptual Swashplate Design for RC heli',
      },
    {
      src: 'assets/images/3d-designs/claw.png',
      alt: 'Adaptive Claw Design',
      },
    {
      src: 'assets/images/3d-designs/car.png',
      alt: 'Conceptual Car Design for Autonomous Passenger Carrier',
      },

  ],
};

const supportedImageExtension = /\.(png|jpe?g|webp)$/i;

function configureImage(img, imageConfig, onFailure) {
  const { src, alt } = imageConfig || {};
  if (!src || !supportedImageExtension.test(src)) {
    console.error(`[Portfolio images] Unsupported or empty image path: ${src || '(empty path)'}`);
    onFailure?.();
    return false;
  }
  img.alt = alt || 'Portfolio project image';
  img.classList.add('lightbox-trigger');
  img.dataset.lightboxSrc = imageConfig.fullSrc || imageConfig.original || src;
  if (!img.closest('button, a, [role="button"]')) {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `View full-size image: ${img.alt}`);
  }
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
    'quad-dialog': ['quadcopter', 'motorDriver'],
    'nabik-dialog': 'nabik',
  };
  Object.entries(dialogProjects).forEach(([dialogId, projectId]) => {
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;
    const projectIds = Array.isArray(projectId) ? projectId : [projectId];
    dialog.dataset.projectId = projectIds.join(' ');
    projectIds.forEach((currentProjectId, projectIndex) => {
      const project = portfolioImages.projects[currentProjectId];
      Object.entries(project).forEach(([sectionKey, configured]) => {
        if (sectionKey === 'videos') return;
        const images = sectionKey === 'main'
          ? (configured?.src ? [configured] : [])
          : (Array.isArray(configured) ? configured : []);
        const slots = [...dialog.querySelectorAll(`[data-project-image-slot="${currentProjectId}:${sectionKey}"]`)];
        if (sectionKey === 'gallery') {
          const gallerySection = slots[0]?.closest('.detail-section');
          if (gallerySection) gallerySection.hidden = images.length === 0;
        }
        // Empty arrays leave the original labeled placeholders in place.
        if (!images.length) return;

        while (slots.length < images.length) {
          const template = slots[0];
          if (!template) {
            console.error(`[Portfolio images] No HTML media slot for ${currentProjectId}:${sectionKey}`);
            break;
          }
          const slot = template.cloneNode(false);
          slot.innerHTML = `<span>${sectionKey.toUpperCase()} IMAGE</span><small>Additional project image</small>`;
          slot.setAttribute('aria-label', `${sectionKey} project image placeholder`);
          slots[slots.length - 1].insertAdjacentElement('afterend', slot);
          slots.push(slot);
        }
        // If fewer images are configured, remove surplus frames from that group.
        slots.slice(images.length).forEach((slot) => slot.remove());
        if (images.length > 1 && slots[0]?.parentElement && !slots[0].parentElement.classList.contains('media-grid') && !slots[0].parentElement.classList.contains('media-gallery')) {
          slots[0].parentElement.classList.add('media-stack');
        }
        images.slice(0, slots.length).forEach((image, index) => {
          mountProjectImage(slots[index], image, currentProjectId, sectionKey, index);
        });
      });
      if (projectIndex === 0) {
        const card = document.querySelector(`[data-dialog="${dialogId}"]`);
        if (card) card.dataset.projectMainCard = currentProjectId;
      }
    });
  });

  document.querySelectorAll('[data-project-main-card]').forEach((card) => {
    const image = portfolioImages.projects[card.dataset.projectMainCard]?.main;
    if (!image?.src) return;
    const img = document.createElement('img');
    img.className = 'project-card-image';
    if (configureImage(img, image, () => img.remove())) card.prepend(img);
  });
}

function mountProjectImage(slot, image, projectId, sectionKey, imageIndex) {
  if (!slot || !image) return;
  if (!slot.dataset.placeholderMarkup) slot.dataset.placeholderMarkup = slot.innerHTML;
  const placeholderMarkup = slot.dataset.placeholderMarkup;
  const img = document.createElement('img');
  if (!configureImage(img, image, () => {
    slot.classList.remove('has-image');
    if (placeholderMarkup) slot.innerHTML = placeholderMarkup;
    else slot.innerHTML = `<span>${sectionKey.toUpperCase()} IMAGE UNAVAILABLE</span><small>Check ${projectId}.${sectionKey}[${imageIndex}] in script.js</small>`;
    slot.setAttribute('role', 'img');
    slot.setAttribute('aria-label', `${sectionKey} project image unavailable`);
  })) return;
  slot.replaceChildren(img);
  slot.classList.add('has-image');
  slot.setAttribute('role', 'group');
  slot.setAttribute('aria-label', image.alt || `${sectionKey} project image`);
}

const supportedVideoExtension = /\.(mp4|webm|ogv|ogg)(?:[?#].*)?$/i;

function getVideoMimeType(src) {
  const extension = src.split(/[?#]/)[0].split('.').pop().toLowerCase();
  return ({ mp4: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg', ogg: 'video/ogg' })[extension] || '';
}

function mountConfiguredProjectVideos() {
  const dialogProjects = {
    'uav-dialog': 'uav',
    'zoom-dialog': 'zoomController',
    'quad-dialog': ['quadcopter', 'motorDriver'],
    'nabik-dialog': 'nabik',
  };

  Object.entries(dialogProjects).forEach(([dialogId, projectConfig]) => {
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;
    const projectIds = Array.isArray(projectConfig) ? projectConfig : [projectConfig];
    projectIds.forEach((projectId) => {
    const sections = [...dialog.querySelectorAll('[data-project-video-section]')];
    const section = sections.find((item) => item.dataset.projectVideoSection === projectId)
      || (projectIds.length === 1 ? sections[0] : null);
    if (!section) return;

    const configuredVideos = portfolioImages.projects[projectId]?.videos;
    const videos = Array.isArray(configuredVideos) ? configuredVideos : [];
    const validVideos = videos.filter((item) => {
      if (!item?.src || !supportedVideoExtension.test(item.src)) {
        console.error(`[Portfolio videos] Unsupported or empty video path for ${projectId}: ${item?.src || '(empty path)'}`);
        return false;
      }
      return true;
    });

    if (!validVideos.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    section.querySelector('.video-placeholder')?.remove();
    section.querySelector('.project-video-list')?.remove();
    const list = document.createElement('div');
    list.className = 'project-video-list';

    validVideos.forEach((item, index) => {
      const figure = document.createElement('figure');
      figure.className = 'project-video-item';
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('aria-label', item.title || `${projectId} project demonstration ${index + 1}`);

      const source = document.createElement('source');
      source.src = item.src;
      source.type = getVideoMimeType(item.src);
      video.append(source);
      video.addEventListener('error', () => {
        console.error(`[Portfolio videos] Could not load: ${item.src}`);
        figure.remove();
        if (!list.querySelector('video')) section.hidden = true;
      }, { once: true });

      if (item.poster) {
        video.poster = item.poster;
        const posterProbe = new Image();
        posterProbe.addEventListener('error', () => {
          video.removeAttribute('poster');
          console.warn(`[Portfolio videos] Could not load poster: ${item.poster}`);
        }, { once: true });
        posterProbe.src = item.poster;
      }

      figure.append(video);
      if (item.title) {
        const caption = document.createElement('figcaption');
        caption.textContent = item.title;
        figure.append(caption);
      }
      list.append(figure);
    });
    section.append(list);
    list.querySelectorAll('video').forEach((video) => video.load());
    });
  });
}

// Center-focused achievement carousel. Add one { src, alt } entry above for each image.
let currentAchievementIndex = 0;
let isAchievementPaused = false;
let achievementAutoplayTimer = null;
let achievementCards = [];
const achievementCarousel = document.getElementById('achievement-carousel');
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

// The 3D Design Showcase uses the same center-focused carousel behavior as Achievements.
let currentDesignIndex = 0;
let isDesignCarouselPaused = false;
let designAutoplayTimer = null;
let designCards = [];
const designCarousel = document.getElementById('design-showcase-carousel');
const designTrack = document.getElementById('design-showcase-track');
const designStatus = document.getElementById('design-showcase-status');
const designMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateDesignCarousel(announce = false) {
  if (!designCarousel || !designTrack) return;
  const count = designCards.length;
  designCarousel.classList.toggle('has-images', count > 0);
  if (!count) {
    designCarousel.classList.remove('is-single');
    if (designStatus) designStatus.textContent = 'No 3D design images are currently available.';
    return;
  }

  designCarousel.classList.toggle('is-single', count === 1);
  const viewportWidth = designCarousel.clientWidth;
  const cardWidth = designCards[0]?.getBoundingClientRect().width || Math.min(350, viewportWidth * (window.innerWidth <= 720 ? 0.78 : 0.31));
  const visibleRadius = viewportWidth <= 900 ? 1 : 2;
  const step = visibleRadius === 1
    ? cardWidth * 0.79
    : Math.min(cardWidth * 0.68, viewportWidth / 4 - cardWidth * 0.19);
  designCards.forEach((card, index) => {
    let relative = (index - currentDesignIndex + count) % count;
    if (relative > count / 2) relative -= count;
    const distance = Math.abs(relative);
    const visible = distance <= visibleRadius;
    const scale = [1.04, 0.88, 0.75][Math.min(distance, 2)];
    card.classList.toggle('active', index === currentDesignIndex);
    card.setAttribute('aria-pressed', String(index === currentDesignIndex));
    card.style.transform = `translate(-50%, -50%) translateX(${relative * step}px) scale(${scale})`;
    card.style.opacity = visible ? String([1, 0.82, 0.54][Math.min(distance, 2)]) : '0';
    card.style.zIndex = String(10 - distance);
    card.style.pointerEvents = visible ? 'auto' : 'none';
    card.tabIndex = visible ? 0 : -1;
    card.setAttribute('aria-hidden', String(!visible));
  });
  if (announce && designStatus) {
    const item = portfolioImages.designShowcase[Number(designCards[currentDesignIndex].dataset.imageIndex)];
    designStatus.textContent = `Design ${currentDesignIndex + 1} of ${count}: ${item?.alt || item?.title || '3D design'}`;
  }
}

function goToDesign(index, announce = true) {
  const count = designCards.length;
  if (!count) return;
  currentDesignIndex = (index + count) % count;
  updateDesignCarousel(announce);
}
function nextDesign() { goToDesign(currentDesignIndex + 1); }
function previousDesign() { goToDesign(currentDesignIndex - 1); }
function stopDesignAutoplay() {
  window.clearInterval(designAutoplayTimer);
  designAutoplayTimer = null;
}
function startDesignAutoplay() {
  stopDesignAutoplay();
  if (designCards.length > 1 && !isDesignCarouselPaused && !designMotionPreference.matches) {
    designAutoplayTimer = window.setInterval(nextDesign, 3600);
  }
}

function createDesignCard(image, imageIndex) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'achievement-card design-showcase-card';
  card.dataset.imageIndex = String(imageIndex);
  card.setAttribute('aria-label', image.alt || image.title || `3D design ${imageIndex + 1}`);
  card.setAttribute('aria-pressed', 'false');
  const img = document.createElement('img');
  img.loading = 'lazy';
  img.alt = image.alt || image.title || `3D design ${imageIndex + 1}`;
  card.append(img);
  const headline = document.createElement('span');
  headline.className = 'design-showcase-title';
  headline.textContent = image.alt || '';
  card.append(headline);
  if (!configureImage(img, image, () => {
    const removedIndex = designCards.indexOf(card);
    if (removedIndex === -1) return;
    card.remove();
    designCards.splice(removedIndex, 1);
    portfolioImages.designShowcase.splice(Number(card.dataset.imageIndex), 1);
    designCards.forEach((remainingCard, index) => { remainingCard.dataset.imageIndex = String(index); });
    currentDesignIndex = designCards.length ? Math.min(currentDesignIndex, designCards.length - 1) : 0;
    updateDesignCarousel();
    startDesignAutoplay();
  })) return null;
  card.addEventListener('click', (event) => {
    event.stopPropagation();
    isDesignCarouselPaused = true;
    stopDesignAutoplay();
    goToDesign(Number(card.dataset.imageIndex));
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); goToDesign(currentDesignIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goToDesign(currentDesignIndex - 1); }
  });
  return card;
}

function initializeDesignShowcase() {
  if (!designCarousel || !designTrack) return;
  portfolioImages.designShowcase.forEach((image, index) => {
    const card = createDesignCard(image, index);
    if (card) { designCards.push(card); designTrack.append(card); }
  });
  updateDesignCarousel();
  designCarousel.addEventListener('keydown', (event) => {
    if (event.target !== designCarousel) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); goToDesign(currentDesignIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goToDesign(currentDesignIndex - 1); }
  });
  designCarousel.addEventListener('pointerenter', () => { isDesignCarouselPaused = true; stopDesignAutoplay(); });
  designCarousel.addEventListener('pointerleave', () => {
    if (!designCarousel.contains(document.activeElement)) {
      isDesignCarouselPaused = false;
      startDesignAutoplay();
    }
  });
  designCarousel.addEventListener('focusin', () => { isDesignCarouselPaused = true; stopDesignAutoplay(); });
  designCarousel.addEventListener('focusout', (event) => {
    if (!designCarousel.contains(event.relatedTarget)) {
      isDesignCarouselPaused = false;
      startDesignAutoplay();
    }
  });
  document.addEventListener('click', (event) => {
    if (isDesignCarouselPaused && !designCarousel.contains(event.target)) {
      isDesignCarouselPaused = false;
      startDesignAutoplay();
    }
  });
  let touchStartX = null;
  designCarousel.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0]?.clientX ?? null; }, { passive: true });
  designCarousel.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) < 42) return;
    isDesignCarouselPaused = true;
    stopDesignAutoplay();
    delta < 0 ? nextDesign() : previousDesign();
  }, { passive: true });
  window.addEventListener('resize', () => updateDesignCarousel());
  designMotionPreference.addEventListener?.('change', () => {
    if (designMotionPreference.matches) stopDesignAutoplay();
    else startDesignAutoplay();
  });
  startDesignAutoplay();
}

initializeDesignShowcase();
mountConfiguredProjectImages();
mountConfiguredProjectVideos();

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
