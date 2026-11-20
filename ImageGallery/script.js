
/* =========================================
   CodeAlpha - Image Gallery
   Developer: Irfan Ullah
   ========================================= */


/* 1. IMAGE DATA */

const images = [
  {
    title: "Hunza Valley",
    category: "Nature",
    src: "images/hunza.jpg"
  },
  {
    title: "Green Forest",
    category: "Nature",
    src: "images/forest.jpg"
  },
  {
    title: "Mountain View",
    category: "Mountains",
    src: "images/mountains.jpg"
  },
  {
    title: "Beautiful Waterfall",
    category: "Water",
    src: "images/waterfall.jpg"
  },
  {
    title: "Ocean View",
    category: "Water",
    src: "images/ocean.jpg"
  },
  {
    title: "Beautiful Beach",
    category: "Travel",
    src: "images/beach.jpg"
  },
  {
    title: "Modern Workspace",
    category: "Lifestyle",
    src: "images/workspace.jpg"
  }
];


/* 2. DOM ELEMENTS */

const $ = id => document.getElementById(id);

const gallery = $("gallery");
const filters = $("filters");
const count = $("count");

const lightbox = $("lightbox");
const lbImg = $("lb-img");
const lbTitle = $("lb-title");
const lbCat = $("lb-cat");
const lbCounter = $("lb-counter");
const spinner = $("lb-spinner");

const playBtn = $("lb-play");
const closeBtn = $("lb-close");
const nextBtn = $("lb-next");
const prevBtn = $("lb-prev");


/* 3. VARIABLES */

let activeFilter = "All";
let visibleImages = [];
let currentIndex = 0;
let slideshow = null;
let lastFocusedElement = null;


/* 4. IMAGE FALLBACK */

function fallbackImage(title) {
  const safeTitle = title.replace(/[<>&"]/g, "");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="600" height="450">
      <rect width="100%" height="100%" fill="#252b4a"/>
      <text x="50%" y="50%"
            fill="#ffffff"
            font-size="25"
            text-anchor="middle"
            font-family="Arial">
        ${safeTitle}
      </text>
    </svg>
  `;

  return "data:image/svg+xml;charset=utf-8," +
         encodeURIComponent(svg);
}


/* 5. CREATE CATEGORY FILTERS */

function createFilters() {

  const categories = [
    "All",
    ...new Set(images.map(image => image.category))
  ];

  filters.innerHTML = "";

  categories.forEach(category => {

    const button = document.createElement("button");

    button.className = "filter-btn";

    button.textContent = category;

    button.setAttribute(
      "aria-pressed",
      category === activeFilter
    );

    if (category === activeFilter) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {

      activeFilter = category;

      createFilters();
      displayImages();

    });

    filters.appendChild(button);

  });

}


/* 6. DISPLAY GALLERY IMAGES */

function displayImages() {

  visibleImages = activeFilter === "All"
    ? images
    : images.filter(
        image => image.category === activeFilter
      );

  gallery.innerHTML = "";

  visibleImages.forEach((image, index) => {

    const card = document.createElement("button");

    card.className = "card";

    card.setAttribute(
      "aria-label",
      `Open ${image.title}`
    );

    const img = document.createElement("img");

    img.onload = () => {
  card.classList.add("loaded");
};

img.onerror = () => {
  img.onerror = null;
  img.src = fallbackImage(image.title);
};

img.src = image.src;
img.alt = image.title;
img.loading = "lazy";

    const overlay = document.createElement("div");

    overlay.className = "overlay";

    const heading = document.createElement("h3");
    heading.textContent = image.title;

    const category = document.createElement("p");
    category.textContent = image.category;

    overlay.append(heading, category);

    const zoom = document.createElement("span");

    zoom.className = "zoom";
    zoom.textContent = "↗";
    zoom.setAttribute("aria-hidden", "true");

    card.append(img, overlay, zoom);

    card.addEventListener("click", () => {
      openLightbox(index, card);
    });

    gallery.appendChild(card);

  });

  count.textContent =
    `Showing ${visibleImages.length} images`;

}


/* 7. OPEN LIGHTBOX */

function openLightbox(index, trigger) {

  lastFocusedElement = trigger;

  lightbox.hidden = false;

  requestAnimationFrame(() => {
    lightbox.classList.add("open");
  });

  document.body.classList.add("no-scroll");

  showImage(index);

  closeBtn.focus();

}


/* 8. DISPLAY SELECTED IMAGE */

function showImage(index) {

  if (visibleImages.length === 0) return;

  currentIndex =
    (index + visibleImages.length) % visibleImages.length;

  const image = visibleImages[currentIndex];

  lbImg.classList.remove("show");

  spinner.classList.add("on");

  lbTitle.textContent = image.title;
  lbCat.textContent = image.category;

  lbCounter.textContent =
    `${currentIndex + 1} / ${visibleImages.length}`;

  lbImg.alt = image.title;

  lbImg.onload = () => {
    lbImg.classList.add("show");
    spinner.classList.remove("on");
  };

  lbImg.onerror = () => {

    lbImg.onerror = null;
    lbImg.src = fallbackImage(image.title);

  };

  lbImg.src = image.src;

}


/* 9. NEXT AND PREVIOUS */

function nextImage() {
  showImage(currentIndex + 1);
}

function previousImage() {
  showImage(currentIndex - 1);
}


/* 10. SLIDESHOW */

function startSlideshow() {

  if (slideshow !== null) return;

  slideshow = setInterval(nextImage, 3000);

  playBtn.textContent = "Ⅱ";

  playBtn.classList.add("playing");

  playBtn.setAttribute(
    "aria-label",
    "Pause slideshow"
  );

}

function stopSlideshow() {

  clearInterval(slideshow);

  slideshow = null;

  playBtn.textContent = "▶";

  playBtn.classList.remove("playing");

  playBtn.setAttribute(
    "aria-label",
    "Start slideshow"
  );

}

function toggleSlideshow() {

  if (slideshow !== null) {
    stopSlideshow();
  } else {
    startSlideshow();
  }

}
// Stop slideshow when browser tab is hidden

document.addEventListener("visibilitychange", () => {

  if (document.hidden && slideshow !== null) {
    stopSlideshow();
  }

});


/* 11. CLOSE LIGHTBOX */

function closeLightbox() {

  stopSlideshow();

  lightbox.classList.remove("open");

  document.body.classList.remove("no-scroll");

  setTimeout(() => {

    if (!lightbox.classList.contains("open")) {
      lightbox.hidden = true;
    }

  }, 350);

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }

}


/* 12. BUTTON EVENTS */

nextBtn.addEventListener("click", nextImage);

prevBtn.addEventListener("click", previousImage);

closeBtn.addEventListener("click", closeLightbox);

playBtn.addEventListener("click", toggleSlideshow);


/* Close when clicking outside the image */

lightbox.addEventListener("click", event => {

  if (event.target === lightbox) {
    closeLightbox();
  }

});


/* 13. KEYBOARD CONTROLS */

document.addEventListener("keydown", event => {

  if (!lightbox.classList.contains("open")) return;

  switch (event.key) {

    case "ArrowRight":
      event.preventDefault();
      nextImage();
      break;

    case "ArrowLeft":
      event.preventDefault();
      previousImage();
      break;

    case "Escape":
      closeLightbox();
      break;

    case " ":

      if (event.target.tagName !== "BUTTON") {
        event.preventDefault();
        toggleSlideshow();
      }

      break;

    case "Tab": {

      const buttons = lightbox.querySelectorAll("button");

      const first = buttons[0];
      const last = buttons[buttons.length - 1];

      if (event.shiftKey &&
          document.activeElement === first) {

        event.preventDefault();
        last.focus();

      } else if (!event.shiftKey &&
                 document.activeElement === last) {

        event.preventDefault();
        first.focus();

      }

      break;
    }

  }

});


/* 14. MOBILE TOUCH SWIPE */

let touchStartX = 0;

lightbox.addEventListener("touchstart", event => {

  touchStartX = event.changedTouches[0].screenX;

}, { passive: true });


lightbox.addEventListener("touchend", event => {

  const touchEndX = event.changedTouches[0].screenX;

  const difference = touchEndX - touchStartX;

  if (Math.abs(difference) > 50) {

    if (difference < 0) {
      nextImage();
    } else {
      previousImage();
    }

  }

}, { passive: true });


/* 15. START APPLICATION */

createFilters();

displayImages();
