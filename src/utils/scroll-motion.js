/**
 * Scroll Motion & Reveal System
 * Provides smooth, GPU-accelerated entrance animations on scroll,
 * scroll progress tracking, and back-to-top interaction without altering content.
 */

export function initScrollMotion() {
  if (typeof window === "undefined") return;

  // 1. Setup Scroll Progress Bar at the top edge of the window
  let progressBar = document.getElementById("scroll-progress-bar");
  if (!progressBar) {
    progressBar = document.createElement("div");
    progressBar.id = "scroll-progress-bar";
    document.body.prepend(progressBar);
  }

  // 2. Setup Floating Back to Top Button
  let backToTopBtn = document.getElementById("back-to-top-btn");
  if (!backToTopBtn) {
    backToTopBtn = document.createElement("button");
    backToTopBtn.id = "back-to-top-btn";
    backToTopBtn.setAttribute("aria-label", "Scroll back to top");
    backToTopBtn.setAttribute("title", "Back to top");
    backToTopBtn.innerHTML = '<span class="material-icons-outlined text-xl">arrow_upward</span>';
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.body.appendChild(backToTopBtn);
  }

  // Update progress bar and back-to-top button on scroll
  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 450) {
        backToTopBtn.classList.add("is-visible");
      } else {
        backToTopBtn.classList.remove("is-visible");
      }
    }
  };

  window.removeEventListener("scroll", handleScroll);
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // 3. Stagger children in containers with [data-scroll-stagger]
  document.querySelectorAll("[data-scroll-stagger]").forEach((container) => {
    const children = Array.from(container.children);
    const staggerStep = parseInt(container.getAttribute("data-scroll-stagger") || "100", 10);
    children.forEach((child, index) => {
      if (!child.hasAttribute("data-scroll-reveal") && !child.classList.contains("scroll-reveal")) {
        child.setAttribute("data-scroll-reveal", "fade-up");
      }
      child.style.transitionDelay = `${index * staggerStep}ms`;
    });
  });

  // 4. Check for reduced motion preference
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    document
      .querySelectorAll(
        "[data-scroll-reveal], .scroll-reveal, .scroll-reveal-up, .scroll-reveal-down, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-zoom, .reveal"
      )
      .forEach((el) => {
        el.classList.add("is-revealed", "active");
      });
    return;
  }

  // 5. IntersectionObserver for Reveal Elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed", "active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  const revealElements = document.querySelectorAll(
    "[data-scroll-reveal], .scroll-reveal, .scroll-reveal-up, .scroll-reveal-down, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-zoom, .reveal"
  );

  revealElements.forEach((el) => {
    // If element is already in the viewport on initial render, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("is-revealed", "active");
    } else {
      observer.observe(el);
    }
  });
}

// Auto-run on DOMContentLoaded and Astro page load
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", initScrollMotion);
  document.addEventListener("astro:page-load", initScrollMotion);
}
