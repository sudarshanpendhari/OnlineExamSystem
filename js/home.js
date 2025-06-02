// Mobile Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  const spans = hamburger.querySelectorAll("span");
  spans[0].style.transform = navLinks.classList.contains("active")
    ? "rotate(45deg) translate(8px, 8px)"
    : "";
  spans[1].style.opacity = navLinks.classList.contains("active") ? "0" : "1";
  spans[2].style.transform = navLinks.classList.contains("active")
    ? "rotate(-45deg) translate(7px, -7px)"
    : "";
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove("active");
    const spans = hamburger.querySelectorAll("span");
    spans[0].style.transform = "";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "";
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
      // Close mobile menu after clicking a link
      navLinks.classList.remove("active");
    }
  });
});

// Scroll-triggered animations
const observerOptions = {
  threshold: 0.2,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
    }
  });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll(".feature-card, .benefit-item").forEach((el) => {
  observer.observe(el);
});
