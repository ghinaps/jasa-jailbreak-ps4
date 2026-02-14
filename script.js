// ===== DOM ELEMENTS =====
const header = document.getElementById("header");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navClose = document.getElementById("nav-close");
const navLinks = document.querySelectorAll(".nav-link");

// ===== HEADER SCROLL EFFECT =====
function handleScroll() {
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
}

window.addEventListener("scroll", handleScroll);

// ===== MOBILE NAVIGATION =====

// Open Menu Function
function openMenu() {
  if (navMenu) {
    navMenu.classList.add("active");
  }
  if (navToggle) {
    navToggle.classList.add("active");
  }
  document.body.style.overflow = "hidden";
}

// Close Menu Function
function closeMenu() {
  if (navMenu) {
    navMenu.classList.remove("active");
  }
  if (navToggle) {
    navToggle.classList.remove("active");
  }
  document.body.style.overflow = "";
}

// Toggle Menu (Hamburger Button)
if (navToggle) {
  navToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (navMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

// Close Button (X)
if (navClose) {
  navClose.addEventListener("click", function (e) {
    e.stopPropagation();
    closeMenu();
  });
}

// ⭐ AUTO CLOSE WHEN NAV LINK CLICKED
navLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // Always close the menu first
    closeMenu();

    // Handle anchor links (same page navigation)
    if (href && href.startsWith("#") && href.length > 1) {
      e.preventDefault();

      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Small delay to let menu close animation finish
        setTimeout(function () {
          const headerHeight = header ? header.offsetHeight : 70;
          const targetPosition = targetSection.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }, 300);
      }
    }
    // For external links or other page links, menu closes and browser navigates normally
  });
});

// Close Menu When Clicking Outside
document.addEventListener("click", function (e) {
  if (navMenu && navMenu.classList.contains("active")) {
    const isClickInsideMenu = navMenu.contains(e.target);
    const isClickOnToggle = navToggle.contains(e.target);

    if (!isClickInsideMenu && !isClickOnToggle) {
      closeMenu();
    }
  }
});

// Close Menu on Escape Key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeMenu();
  }
});

// Close Menu on Window Resize
window.addEventListener("resize", function () {
  if (window.innerWidth > 768) {
    closeMenu();
  }
});

// ===== FAQ ACCORDION =====
function toggleFaq(button) {
  const faqItem = button.closest(".faq-item");
  if (!faqItem) return;

  const isActive = faqItem.classList.contains("active");

  // Close all FAQ items
  document.querySelectorAll(".faq-item").forEach(function (item) {
    item.classList.remove("active");
  });

  // Open clicked item if it wasn't active
  if (!isActive) {
    faqItem.classList.add("active");
  }
}

// ===== FORM VALIDATION =====
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("nama");
    const telepon = document.getElementById("telepon");
    const email = document.getElementById("email");
    const firmware = document.getElementById("firmware-input");
    const pesan = document.getElementById("pesan");

    let isValid = true;

    // Validate nama
    if (nama && nama.value.trim().length < 3) {
      showError(nama, "Nama minimal 3 karakter");
      isValid = false;
    } else if (nama) {
      clearError(nama);
    }

    // Validate telepon
    const phoneRegex = /^[0-9]{10,13}$/;
    if (telepon && !phoneRegex.test(telepon.value.replace(/\D/g, ""))) {
      showError(telepon, "Nomor telepon tidak valid (10-13 digit)");
      isValid = false;
    } else if (telepon) {
      clearError(telepon);
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email.value)) {
      showError(email, "Format email tidak valid");
      isValid = false;
    } else if (email) {
      clearError(email);
    }

    // If valid, send to WhatsApp
    if (isValid) {
      let message = `Halo, saya ingin konsultasi jailbreak PS4.\n\n`;
      message += `*Nama:* ${nama.value}\n`;
      message += `*Telepon:* ${telepon.value}\n`;
      message += `*Email:* ${email.value}\n`;
      if (firmware && firmware.value) {
        message += `*Firmware PS4:* ${firmware.value}\n`;
      }
      if (pesan && pesan.value) {
        message += `*Pesan:* ${pesan.value}`;
      }

      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/6281318229451?text=${encodedMessage}`;

      // Show success modal if exists
      const modal = document.getElementById("success-modal");
      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }

      // Reset form
      contactForm.reset();

      // Redirect to WhatsApp
      setTimeout(function () {
        window.open(waUrl, "_blank");
      }, 2000);
    }
  });
}

function showError(input, message) {
  input.classList.add("error");
  input.classList.remove("success");
  const errorEl = document.getElementById(input.id + "-error");
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearError(input) {
  input.classList.remove("error");
  input.classList.add("success");
  const errorEl = document.getElementById(input.id + "-error");
  if (errorEl) {
    errorEl.textContent = "";
  }
}

// ===== MODAL =====
function closeModal() {
  const modal = document.getElementById("success-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Close modal on overlay click
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal-overlay")) {
    closeModal();
  }
});

// ===== TESTIMONI SLIDER =====
let currentSlide = 0;
let slideWidth = 0;
let maxSlide = 0;
let startX = 0;
let isDragging = false;
let currentTranslate = 0;
let prevTranslate = 0;

const sliderTrack = document.getElementById("sliderTrack");
const sliderDots = document.getElementById("sliderDots");

function initSlider() {
  if (!sliderTrack) return;

  const cards = sliderTrack.querySelectorAll(".testimoni-card, .testi-card");
  const wrapper = sliderTrack.parentElement;

  if (!cards.length) return;

  const gap = 24;
  let visibleCards = 3;

  if (window.innerWidth <= 480) {
    visibleCards = 1;
  } else if (window.innerWidth <= 768) {
    visibleCards = 1;
  } else if (window.innerWidth <= 1024) {
    visibleCards = 2;
  }

  const wrapperWidth = wrapper.offsetWidth;
  slideWidth = wrapperWidth / visibleCards;

  cards.forEach(function (card) {
    card.style.flex = `0 0 ${slideWidth - gap}px`;
    card.style.minWidth = `${slideWidth - gap}px`;
  });

  maxSlide = Math.max(0, cards.length - visibleCards);

  createDots();
  goToSlide(currentSlide);
  addSliderTouchEvents();
}

function createDots() {
  if (!sliderDots) return;
  sliderDots.innerHTML = "";

  for (let i = 0; i <= maxSlide; i++) {
    const dot = document.createElement("button");
    dot.className = "slider-dot" + (i === currentSlide ? " active" : "");
    dot.onclick = function () {
      goToSlide(i);
    };
    sliderDots.appendChild(dot);
  }
}

function updateDots() {
  if (!sliderDots) return;
  const dots = sliderDots.querySelectorAll(".slider-dot");
  dots.forEach(function (dot, i) {
    dot.classList.toggle("active", i === currentSlide);
  });
}

function goToSlide(index) {
  if (!sliderTrack) return;

  currentSlide = Math.max(0, Math.min(index, maxSlide));
  const translateX = -currentSlide * slideWidth;

  sliderTrack.style.transition = "transform 0.4s ease-out";
  sliderTrack.style.transform = `translateX(${translateX}px)`;

  currentTranslate = translateX;
  prevTranslate = translateX;

  updateDots();
  updateSliderButtons();
}

function slideTestimoni(direction) {
  goToSlide(currentSlide + direction);
}

function updateSliderButtons() {
  const prevBtn = document.querySelector(".slider-btn-prev");
  const nextBtn = document.querySelector(".slider-btn-next");

  if (prevBtn) prevBtn.disabled = currentSlide === 0;
  if (nextBtn) nextBtn.disabled = currentSlide >= maxSlide;
}

function addSliderTouchEvents() {
  if (!sliderTrack) return;
  const wrapper = sliderTrack.parentElement;

  // Touch events
  wrapper.addEventListener(
    "touchstart",
    function (e) {
      isDragging = true;
      startX = e.touches[0].clientX;
      sliderTrack.style.transition = "none";
    },
    { passive: true },
  );

  wrapper.addEventListener(
    "touchmove",
    function (e) {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      currentTranslate = prevTranslate + diff;
      sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
    },
    { passive: true },
  );

  wrapper.addEventListener("touchend", function () {
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -50 && currentSlide < maxSlide) {
      currentSlide++;
    } else if (movedBy > 50 && currentSlide > 0) {
      currentSlide--;
    }
    goToSlide(currentSlide);
  });

  // Mouse events for desktop
  wrapper.addEventListener("mousedown", function (e) {
    isDragging = true;
    startX = e.clientX;
    sliderTrack.style.transition = "none";
  });

  wrapper.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    currentTranslate = prevTranslate + diff;
    sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
  });

  wrapper.addEventListener("mouseup", function () {
    if (!isDragging) return;
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -50 && currentSlide < maxSlide) {
      currentSlide++;
    } else if (movedBy > 50 && currentSlide > 0) {
      currentSlide--;
    }
    goToSlide(currentSlide);
  });

  wrapper.addEventListener("mouseleave", function () {
    if (isDragging) {
      isDragging = false;
      goToSlide(currentSlide);
    }
  });
}

// ===== SCROLL TO TOP ON LOGO CLICK =====
document.querySelectorAll(".nav-logo, .footer-logo").forEach(function (logo) {
  logo.addEventListener("click", function (e) {
    if (
      this.getAttribute("href") === "#" ||
      this.getAttribute("href") === "index.html"
    ) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll("section[id]");

function updateActiveNavLink() {
  const scrollY = window.pageYOffset;

  sections.forEach(function (section) {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");
    const navLink = document.querySelector(
      '.nav-link[href="#' + sectionId + '"]',
    );

    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove("active");
        });
        navLink.classList.add("active");
      }
    }
  });
}

window.addEventListener("scroll", updateActiveNavLink);

// ===== PHONE NUMBER FORMATTING =====
const teleponInput = document.getElementById("telepon");
if (teleponInput) {
  teleponInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    e.target.value = value;
  });
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener("DOMContentLoaded", function () {
  // Initialize header scroll effect
  handleScroll();

  // Initialize active nav link
  updateActiveNavLink();

  // Initialize slider if exists
  initSlider();

  console.log("🎮 PS4 Jailbreak Pro - Page Loaded Successfully!");
});

// ===== REINITIALIZE SLIDER ON RESIZE =====
let resizeTimer;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    currentSlide = 0;
    initSlider();
  }, 250);
});
