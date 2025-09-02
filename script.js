import { generateBotResponse } from "./chatbot.js";

// Global Variables
let currentSlide = 0;
const slides = document.querySelectorAll(".news-slide");
let slideInterval;

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
  initializeScrollEffects();
  initializeNewsSlider();
  initializeContactForm();
  initializeFloatingChat();
  initializeAnimations();

  // Initialize scroll reveal
  observeElements();
});

// Navigation Functionality
function initializeNavigation() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const navbar = document.getElementById("navbar");

  // Toggle mobile menu
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
  });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let currentSection = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.clientHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-section") === currentSection) {
      link.classList.add("active");
    }
  });
}

// Scroll Effects and Intersection Observer
function initializeScrollEffects() {
  // Create intersection observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");

        // Add staggered animation for grid items
        if (
          entry.target.classList.contains("program-card") ||
          entry.target.classList.contains("faculty-card")
        ) {
          const index = Array.from(entry.target.parentElement.children).indexOf(
            entry.target
          );
          entry.target.style.animationDelay = `${index * 0.1}s`;
        }
      }
    });
  }, observerOptions);

  // Observe all sections and cards
  const elementsToObserve = document.querySelectorAll(
    ".section, .program-card, .faculty-card, .about-item, .research-item, .publication-item, .contact-item"
  );
  elementsToObserve.forEach((element) => {
    observer.observe(element);
  });
}

// News Slider Functionality
function initializeNewsSlider() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dots = document.querySelectorAll(".dot");

  if (slides.length === 0) return;

  // Initialize first slide
  showSlide(0);

  // Auto-play slider
  startSlideShow();

  // Previous button
  prevBtn.addEventListener("click", function () {
    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    showSlide(currentSlide);
    resetSlideShow();
  });

  // Next button
  nextBtn.addEventListener("click", function () {
    currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    showSlide(currentSlide);
    resetSlideShow();
  });

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      currentSlide = index;
      showSlide(currentSlide);
      resetSlideShow();
    });
  });

  // Pause on hover
  const sliderContainer = document.querySelector(".slider-container");
  sliderContainer.addEventListener("mouseenter", stopSlideShow);
  sliderContainer.addEventListener("mouseleave", startSlideShow);
}

function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove("active"));
  document
    .querySelectorAll(".dot")
    .forEach((dot) => dot.classList.remove("active"));

  if (slides[index]) {
    slides[index].classList.add("active");
    document
      .querySelector(`.dot[data-slide="${index}"]`)
      .classList.add("active");
  }
}

function startSlideShow() {
  slideInterval = setInterval(function () {
    currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    showSlide(currentSlide);
  }, 5000);
}

function stopSlideShow() {
  clearInterval(slideInterval);
}

function resetSlideShow() {
  stopSlideShow();
  startSlideShow();
}

// Contact Form Functionality
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    // Basic validation
    if (!name || !email || !subject || !message) {
      showNotification("Please fill in all fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    setTimeout(function () {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      contactForm.reset();
      showNotification(
        "Message sent successfully! We'll get back to you soon.",
        "success"
      );
    }, 2000);
  });

  // Form field animations
  const formInputs = document.querySelectorAll(
    ".form-group input, .form-group textarea"
  );
  formInputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      if (!this.value) {
        this.parentElement.classList.remove("focused");
      }
    });
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <i class="fas ${
          type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
        }"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

  // Add notification styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${
          type === "success"
            ? "rgba(0, 255, 136, 0.9)"
            : "rgba(255, 69, 58, 0.9)"
        };
        color: var(--primary-bg);
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        backdrop-filter: blur(10px);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Close button functionality
  const closeButton = notification.querySelector(".notification-close");
  closeButton.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-left: auto;
        padding: 0.25rem;
    `;

  closeButton.addEventListener("click", () => removeNotification(notification));

  // Auto remove after 5 seconds
  setTimeout(() => removeNotification(notification), 5000);
}

function removeNotification(notification) {
  notification.style.transform = "translateX(100%)";
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// Floating Chat Functionality
function initializeFloatingChat() {
  const chatButton = document.getElementById("chatButton");
  const chatPanel = document.getElementById("chatPanel");
  const chatClose = document.getElementById("chatClose");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");
  const chatMessages = document.getElementById("chatMessages");

  let chatOpen = false;

  // Toggle chat panel
  chatButton.addEventListener("click", function () {
    chatOpen = !chatOpen;
    chatPanel.classList.toggle("active", chatOpen);

    if (chatOpen) {
      chatInput.focus();
    }
  });

  // Close chat panel
  chatClose.addEventListener("click", function () {
    chatOpen = false;
    chatPanel.classList.remove("active");
  });

  // Send message functionality
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, "user");
    chatInput.value = "";

    // Simulate bot response
    const botResponse = await generateBotResponse(message);
    console.log(botResponse);

    addMessage(botResponse, "bot");
  }

  chatSend.addEventListener("click", sendMessage);

  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Close chat when clicking outside
  document.addEventListener("click", function (e) {
    if (
      chatOpen &&
      !chatButton.contains(e.target) &&
      !chatPanel.contains(e.target)
    ) {
      chatOpen = false;
      chatPanel.classList.remove("active");
    }
  });
}

function addMessage(text, sender) {
  const chatMessages = document.getElementById("chatMessages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`;
  messageDiv.innerHTML = `<p>${text}</p>`;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Animate message in
  messageDiv.style.transform = "translateY(20px)";
  messageDiv.style.opacity = "0";
  setTimeout(() => {
    messageDiv.style.transform = "translateY(0)";
    messageDiv.style.opacity = "1";
    messageDiv.style.transition = "all 0.3s ease";
  }, 100);
}

// Advanced Animations and Effects
function initializeAnimations() {
  // Parallax effect for hero section
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll(".floating-shapes");

    parallaxElements.forEach((element) => {
      const speed = 0.5;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Typing effect for hero title
  const titleLines = document.querySelectorAll(".title-line");
  titleLines.forEach((line, index) => {
    const text = line.textContent;
    line.textContent = "";
    line.style.opacity = "1";

    setTimeout(() => {
      typeText(line, text, 100);
    }, index * 1000 + 500);
  });

  // Counter animation for stats
  const statNumbers = document.querySelectorAll(".stat-number");
  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  });

  statNumbers.forEach((stat) => {
    statsObserver.observe(stat);
  });

  // Hover effects for cards
  addCardHoverEffects();
}

function typeText(element, text, speed) {
  let i = 0;
  const timer = setInterval(function () {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
}

function animateCounter(element) {
  const target = parseInt(element.textContent.replace(/\D/g, ""));
  const suffix = element.textContent.replace(/\d/g, "");
  let current = 0;
  const increment = target / 100;

  const timer = setInterval(function () {
    current += increment;
    if (current >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 20);
}

function addCardHoverEffects() {
  const cards = document.querySelectorAll(".program-card, .faculty-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
}

// Intersection Observer for scroll reveal animations
function observeElements() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const slideInObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const direction = entry.target.dataset.animation || "fade-in";
        entry.target.classList.add(direction);
        slideInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add data attributes for different animations
  const aboutItems = document.querySelectorAll(".about-item");
  aboutItems.forEach((item, index) => {
    item.dataset.animation =
      index % 2 === 0 ? "slide-in-left" : "slide-in-right";
    slideInObserver.observe(item);
  });

  const researchItems = document.querySelectorAll(".research-item");
  researchItems.forEach((item, index) => {
    item.dataset.animation = "slide-in-left";
    item.style.animationDelay = `${index * 0.2}s`;
    slideInObserver.observe(item);
  });

  const publicationItems = document.querySelectorAll(".publication-item");
  publicationItems.forEach((item, index) => {
    item.dataset.animation = "slide-in-right";
    item.style.animationDelay = `${index * 0.2}s`;
    slideInObserver.observe(item);
  });

  const contactItems = document.querySelectorAll(".contact-item");
  contactItems.forEach((item, index) => {
    item.dataset.animation =
      index % 2 === 0 ? "slide-in-left" : "slide-in-right";
    slideInObserver.observe(item);
  });
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Performance optimizations
const debouncedScroll = debounce(updateActiveNavLink, 10);
window.addEventListener("scroll", debouncedScroll);

// Lazy loading for images (if any are added later)
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Keyboard navigation support
document.addEventListener("keydown", function (e) {
  // ESC key closes chat panel
  if (e.key === "Escape") {
    const chatPanel = document.getElementById("chatPanel");
    if (chatPanel.classList.contains("active")) {
      chatPanel.classList.remove("active");
    }
  }

  // Arrow keys for slider navigation
  //   if (e.key === "ArrowLeft") {
  //     const prevBtn = document.getElementById("prevBtn");
  //     if (prevBtn) prevBtn.click();
  //   } else if (e.key === "ArrowRight") {
  //     const nextBtn = document.getElementById("nextBtn");
  //     if (nextBtn) nextBtn.click();
  //   }
});

// Add smooth reveal animations for sections
function revealSection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}

// Error handling for missing elements
function safeElementOperation(selector, operation) {
  const element = document.querySelector(selector);
  if (element) {
    operation(element);
  } else {
    console.warn(`Element with selector "${selector}" not found`);
  }
}

// Initialize everything when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("CS Department website loaded successfully!");
  });
} else {
  console.log("CS Department website loaded successfully!");
}

// Service Worker registration for PWA (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    // Uncomment if you add a service worker
    // navigator.serviceWorker.register('/sw.js')
    //     .then(registration => console.log('SW registered'))
    //     .catch(error => console.log('SW registration failed'));
  });
}
