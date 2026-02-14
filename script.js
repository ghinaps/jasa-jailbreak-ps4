// ===== DOM ELEMENTS =====
const header = document.getElementById("header");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navClose = document.getElementById("nav-close");
const navLinks = document.querySelectorAll(".nav-link");
const faqItems = document.querySelectorAll(".faq-item");
const contactForm = document.getElementById("contact-form");
const successModal = document.getElementById("success-modal");

// ===== HEADER SCROLL EFFECT =====
function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", handleScroll);

// ===== MOBILE NAVIGATION =====
function openMenu() {
  navMenu.classList.add("active");
  navToggle.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  navMenu.classList.remove("active");
  navToggle.classList.remove("active");
  document.body.style.overflow = "";
}

navToggle.addEventListener("click", () => {
  if (navMenu.classList.contains("active")) {
    closeMenu();
  } else {
    openMenu();
  }
});

navClose.addEventListener("click", closeMenu);

// Close menu when clicking nav links
navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    navMenu.classList.contains("active") &&
    !navMenu.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    closeMenu();
  }
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetSection.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ===== FAQ ACCORDION =====
faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    // Close all FAQ items
    faqItems.forEach((faq) => {
      faq.classList.remove("active");
      faq.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add("active");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

// ===== FORM VALIDATION =====
const validators = {
  nama: {
    validate: (value) => value.trim().length >= 3,
    message: "Nama harus minimal 3 karakter",
  },
  telepon: {
    validate: (value) => /^[0-9]{10,13}$/.test(value.replace(/\D/g, "")),
    message: "Nomor telepon tidak valid (10-13 digit)",
  },
  email: {
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: "Format email tidak valid",
  },
};

function validateField(fieldName, value) {
  const validator = validators[fieldName];
  if (!validator) return true;

  const input = document.getElementById(fieldName);
  const errorSpan = document.getElementById(`${fieldName}-error`);

  if (!validator.validate(value)) {
    input.classList.add("error");
    input.classList.remove("success");
    if (errorSpan) errorSpan.textContent = validator.message;
    return false;
  } else {
    input.classList.remove("error");
    input.classList.add("success");
    if (errorSpan) errorSpan.textContent = "";
    return true;
  }
}

// Real-time validation
["nama", "telepon", "email"].forEach((fieldName) => {
  const input = document.getElementById(fieldName);
  if (input) {
    input.addEventListener("blur", () => {
      validateField(fieldName, input.value);
    });

    input.addEventListener("input", () => {
      if (input.classList.contains("error")) {
        validateField(fieldName, input.value);
      }
    });
  }
});

// Form submission
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const telepon = document.getElementById("telepon").value;
  const email = document.getElementById("email").value;
  const firmware = document.getElementById("firmware-input").value;
  const pesan = document.getElementById("pesan").value;

  // Validate all required fields
  const isNamaValid = validateField("nama", nama);
  const isTeleponValid = validateField("telepon", telepon);
  const isEmailValid = validateField("email", email);

  if (isNamaValid && isTeleponValid && isEmailValid) {
    // Prepare WhatsApp message
    let waMessage = `Halo, saya ingin konsultasi jailbreak PS4.\n\n`;
    waMessage += `*Nama:* ${nama}\n`;
    waMessage += `*Telepon:* ${telepon}\n`;
    waMessage += `*Email:* ${email}\n`;
    if (firmware) waMessage += `*Firmware PS4:* ${firmware}\n`;
    if (pesan) waMessage += `*Pesan:* ${pesan}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(waMessage);

    // Show success modal
    showModal();

    // Reset form
    contactForm.reset();
    document.querySelectorAll(".form-input").forEach((input) => {
      input.classList.remove("success", "error");
    });

    // Redirect to WhatsApp after a short delay
    setTimeout(() => {
      window.open(
        `https://wa.me/6281318229451?text=${encodedMessage}`,
        "_blank",
      );
    }, 2000);
  }
});

// ===== MODAL FUNCTIONS =====
function showModal() {
  successModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  successModal.classList.remove("active");
  document.body.style.overflow = "";
}

// Close modal when clicking overlay
document.querySelector(".modal-overlay")?.addEventListener("click", closeModal);

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && successModal.classList.contains("active")) {
    closeModal();
  }
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for animation
document
  .querySelectorAll(".feature-card, .testimoni-card, .faq-item, .trust-item")
  .forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });

// Add animation class styles dynamically
const style = document.createElement("style");
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll("section[id]");

function updateActiveNavLink() {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove("active"));
        navLink.classList.add("active");
      }
    }
  });
}

window.addEventListener("scroll", updateActiveNavLink);

// ===== PHONE NUMBER FORMATTING =====
const teleponInput = document.getElementById("telepon");
if (teleponInput) {
  teleponInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    e.target.value = value;
  });
}

// ===== SCROLL TO TOP ON LOGO CLICK =====
document.querySelectorAll(".nav-logo, .footer-logo").forEach((logo) => {
  logo.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

// ===== COPY PHONE NUMBER TO CLIPBOARD =====
document.querySelectorAll(".kontak-item").forEach((item) => {
  const detail = item.querySelector(".kontak-detail p");
  if (detail && detail.textContent.match(/^\d/)) {
    item.style.cursor = "pointer";
    item.title = "Klik untuk menyalin";

    item.addEventListener("click", () => {
      navigator.clipboard.writeText(detail.textContent).then(() => {
        const originalText = detail.textContent;
        detail.textContent = "Tersalin! ✓";
        detail.style.color = "#25D366";

        setTimeout(() => {
          detail.textContent = originalText;
          detail.style.color = "";
        }, 2000);
      });
    });
  }
});

// ===== IMAGE LAZY LOADING FALLBACK =====
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", function () {
    this.src =
      "https://via.placeholder.com/500x400/1a2744/ffffff?text=PS4+Jailbreak";
    this.alt = "PlayStation 4 Console";
  });
});

// ===== INITIALIZE =====
document.addEventListener("DOMContentLoaded", () => {
  handleScroll();
  updateActiveNavLink();
  console.log("🎮 PS4 Jailbreak Pro - Landing Page Loaded Successfully!");
});
// ===== FAQ ACCORDION =====
function toggleFaq(button) {
  // Ambil parent faq-item
  const faqItem = button.closest(".faq-item");

  if (!faqItem) return;

  // Cek apakah sudah aktif
  const isActive = faqItem.classList.contains("active");

  // Tutup semua FAQ item yang terbuka
  const allFaqItems = document.querySelectorAll(".faq-item");
  allFaqItems.forEach((item) => {
    item.classList.remove("active");
  });

  // Jika belum aktif, buka FAQ yang diklik
  if (!isActive) {
    faqItem.classList.add("active");
  }
}

// Alternatif: Auto-attach event listeners (jika tidak pakai onclick)
document.addEventListener("DOMContentLoaded", function () {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      toggleFaq(this);
    });
  });
});
