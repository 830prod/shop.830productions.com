(() => {
  const loader = document.querySelector(".site-loader");

  window.addEventListener("load", () => {
    if (!loader) {
      return;
    }

    loader.classList.add("is-hidden");
    window.setTimeout(() => loader.remove(), 700);
  });

  const revealNodes = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealNodes.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("visible"));
  }

  const tiltCards = document.querySelectorAll(".tilt-card");

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (window.innerWidth < 900) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform =
        `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  const glow = document.querySelector(".cursor-glow");

  if (glow instanceof HTMLElement) {
    window.addEventListener(
      "pointermove",
      (event) => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
      },
      { passive: true }
    );
  }

  const filterButtons = document.querySelectorAll("[data-filter]");
  const productCards = document.querySelectorAll(".product-card[data-category]");

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        productCards.forEach((card) => {
          const category = card.getAttribute("data-category");
          const shouldShow = filter === "all" || filter === category;

          card.classList.toggle("is-hidden", !shouldShow);
        });
      });
    });
  }

  const carousels = document.querySelectorAll("[data-carousel]");

  carousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
    const prevButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");

    if (slides.length < 2) {
      return;
    }

    let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

    if (activeIndex < 0) {
      activeIndex = 0;
    }

    const renderCarousel = (index) => {
      activeIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-pressed", String(isActive));
      });
    };

    prevButton?.addEventListener("click", () => {
      renderCarousel(activeIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
      renderCarousel(activeIndex + 1);
    });

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => {
        renderCarousel(dotIndex);
      });
    });

    let autoAdvanceId = window.setInterval(() => {
      renderCarousel(activeIndex + 1);
    }, 4500);

    const pauseAutoAdvance = () => {
      window.clearInterval(autoAdvanceId);
    };

    const resumeAutoAdvance = () => {
      pauseAutoAdvance();
      autoAdvanceId = window.setInterval(() => {
        renderCarousel(activeIndex + 1);
      }, 4500);
    };

    carousel.addEventListener("pointerenter", pauseAutoAdvance);
    carousel.addEventListener("pointerleave", resumeAutoAdvance);
    carousel.addEventListener("focusin", pauseAutoAdvance);
    carousel.addEventListener("focusout", (event) => {
      const nextFocusedElement =
        event.relatedTarget instanceof Node ? event.relatedTarget : null;

      if (nextFocusedElement && carousel.contains(nextFocusedElement)) {
        return;
      }

      resumeAutoAdvance();
    });

    renderCarousel(activeIndex);
  });

  const stripeButtons = document.querySelectorAll("[data-stripe-link-id]");
  const stripeStatus = document.querySelector("[data-stripe-status]");

  if (stripeButtons.length > 0) {
    const stripeConfig =
      typeof window.STRIPE_PAYMENT_LINKS === "object" && window.STRIPE_PAYMENT_LINKS !== null
        ? window.STRIPE_PAYMENT_LINKS
        : { products: {} };
    const productLinks =
      typeof stripeConfig.products === "object" && stripeConfig.products !== null
        ? stripeConfig.products
        : {};
    const setStripeStatus = (message, state = "warning") => {
      if (!(stripeStatus instanceof HTMLElement)) {
        return;
      }

      stripeStatus.textContent = message;
      stripeStatus.setAttribute("data-state", state);
    };

    let configuredCount = 0;

    stripeButtons.forEach((button) => {
      const productId = button.getAttribute("data-stripe-link-id") || "";
      const checkoutUrl =
        productId && typeof productLinks[productId] === "string" ? productLinks[productId].trim() : "";

      if (!checkoutUrl || !checkoutUrl.startsWith("https://")) {
        button.classList.add("is-disabled");
        button.textContent = "Stripe Link Needed";
        button.setAttribute("disabled", "true");
        button.setAttribute("aria-disabled", "true");
        return;
      }

      configuredCount += 1;
      button.classList.add("is-live");
      button.addEventListener("click", () => {
        window.location.href = checkoutUrl;
      });
    });

    if (configuredCount === stripeButtons.length) {
      setStripeStatus("Checkout is live for all products.", "success");
    } else if (configuredCount > 0) {
      setStripeStatus(`Checkout is live for ${configuredCount} of ${stripeButtons.length} products.`, "warning");
    } else {
      setStripeStatus("No Stripe product links are active yet.", "warning");
    }
  }
})();
