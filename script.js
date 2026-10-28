import { currentUser, watchNavState } from "./auth.js";

(() => {
  // Products marked `hidden` are left out everywhere, including their own page.
  const products = (Array.isArray(window.SHOP_PRODUCTS) ? window.SHOP_PRODUCTS : []).filter(
    (product) => !product.hidden
  );
  const stripeLinks =
    window.STRIPE_PAYMENT_LINKS && typeof window.STRIPE_PAYMENT_LINKS.products === "object"
      ? window.STRIPE_PAYMENT_LINKS.products
      : {};

  const formatPrice = (price) => (typeof price === "number" ? `$${price.toFixed(2)}` : "Coming soon");

  const checkoutUrlFor = (product, color) => {
    const linkId = color?.linkId || product.linkId;
    const url = typeof stripeLinks[linkId] === "string" ? stripeLinks[linkId].trim() : "";
    return product.price !== null && url.startsWith("https://") ? url : "";
  };

  const imagesFor = (product, color) => (color ? color.images : product.images) || [];

  // Payment Link with the buyer's Firebase UID attached, so the order webhook
  // can file the purchase under their account.
  const paymentLinkFor = (product, color, user) => {
    const url = new URL(checkoutUrlFor(product, color));
    url.searchParams.set("client_reference_id", user.uid);
    if (user.email) {
      url.searchParams.set("prefilled_email", user.email);
    }
    return url.toString();
  };

  const pageFor = (product) => `${product.slug}.html`;

  watchNavState();

  // ---------- Header ----------

  const header = document.querySelector(".site-header");

  if (header) {
    const syncHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
      document.documentElement.style.setProperty("--header-h", `${header.getBoundingClientRect().height}px`);
    };

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
    window.addEventListener("resize", syncHeader);
  }

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  // ---------- Shop grid ----------

  const grid = document.querySelector("[data-product-grid]");

  if (grid) {
    grid.innerHTML = products
      .map((product) => {
        const images = imagesFor(product, product.colors?.[0]);
        const swatches = product.colors
          ? `<span class="swatch-dots" aria-label="${product.colors.length} colors">${product.colors
              .map((color) => `<span style="--swatch: ${color.swatch}" title="${color.name}"></span>`)
              .join("")}</span>`
          : "";
        const flag = product.price === null ? `<span class="product-flag">Coming soon</span>` : "";

        return `
          <a class="product-card" href="${pageFor(product)}" data-category="${product.category}">
            <div class="product-media">
              ${flag}
              <img src="${images[0]?.src}" alt="${images[0]?.alt || product.name}" loading="lazy" width="1200" height="1200">
              ${images[1] ? `<img class="img-alt" src="${images[1].src}" alt="" loading="lazy" width="1200" height="1200">` : ""}
            </div>
            <div class="product-body">
              <div class="product-meta">
                <span class="label">${product.tag}</span>
                <span class="product-price${product.price === null ? " is-soon" : ""}">${formatPrice(product.price)}</span>
              </div>
              <h3>${product.name}</h3>
              <p>${product.blurb}</p>
              <div class="product-foot">
                ${swatches}
                <span class="text-link">View <span class="arrow" aria-hidden="true">&rarr;</span></span>
              </div>
            </div>
          </a>`;
      })
      .join("");

    const filterButtons = document.querySelectorAll("[data-filter]");
    const cards = grid.querySelectorAll(".product-card");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        filterButtons.forEach((item) => {
          const isActive = item === button;
          item.classList.toggle("active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });

        cards.forEach((card) => {
          card.hidden = filter !== "all" && card.getAttribute("data-category") !== filter;
        });
      });
    });
  }

  // ---------- Product page ----------

  const productRoot = document.querySelector("[data-product]");

  if (productRoot) {
    const slug = productRoot.getAttribute("data-product");
    const product = products.find((item) => item.slug === slug);

    if (!product) {
      productRoot.innerHTML = `
        <div class="wrap product-missing">
          <span class="label">Shop</span>
          <h1 class="heading">We couldn't find that product.</h1>
          <a class="btn btn-primary" href="index.html">Back to the shop</a>
        </div>`;

      const relatedSection = document.querySelector("[data-related]")?.closest("section");
      if (relatedSection) {
        relatedSection.hidden = true;
      }
    } else {
      renderProduct(productRoot, product);
    }
  }

  function renderProduct(root, product) {
    const params = new URLSearchParams(window.location.search);
    const colorParam = (params.get("color") || "").toLowerCase();
    let color =
      product.colors?.find((item) => item.name.toLowerCase().replace(/\s+/g, "-") === colorParam) ||
      product.colors?.[0] ||
      null;
    let imageIndex = 0;

    const categoryLabel = product.category === "digital" ? "Digital" : "Merch";
    const colorGroup = product.colors
      ? `
        <fieldset class="option-group">
          <legend>${product.colorLabel || "Color"} <strong data-color-name></strong></legend>
          <div class="swatches" role="radiogroup" aria-label="${product.colorLabel || "Color"}">
            ${product.colors
              .map(
                (item, index) =>
                  `<button class="swatch" type="button" role="radio" style="--swatch: ${item.swatch}" aria-label="${item.name}" title="${item.name}" data-color-index="${index}"></button>`
              )
              .join("")}
          </div>
        </fieldset>`
      : "";

    root.innerHTML = `
      <div class="wrap">
        <ol class="breadcrumb">
          <li><a href="index.html">Shop</a></li>
          <li><a href="index.html#products">${categoryLabel}</a></li>
          <li><span aria-current="page">${product.name}</span></li>
        </ol>

        <div class="product-layout">
          <div class="gallery">
            <div class="gallery-main">
              <img data-gallery-image src="" alt="" width="1200" height="1200">
              <button class="gallery-nav gallery-prev" type="button" data-gallery-prev aria-label="Previous image">&larr;</button>
              <button class="gallery-nav gallery-next" type="button" data-gallery-next aria-label="Next image">&rarr;</button>
              <span class="gallery-count" data-gallery-count></span>
            </div>
            <div class="gallery-thumbs" data-gallery-thumbs></div>
          </div>

          <div class="product-info">
            <span class="label">${product.tag}</span>
            <h1>${product.name}</h1>
            <span class="big-price${product.price === null ? " is-soon" : ""}">${formatPrice(product.price)}</span>
            <p class="lede">${product.description}</p>

            ${colorGroup}

            <div class="buy-block">
              <button class="btn btn-primary" type="button" data-buy>Buy now</button>
              <p class="buy-note" data-buy-note>${product.checkoutNote}</p>
              <span class="secure-line">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg>
                Secure checkout by Stripe
              </span>
            </div>

            <ul class="detail-list">
              ${product.details.map((detail) => `<li>${detail}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>`;

    const mainImage = root.querySelector("[data-gallery-image]");
    const thumbs = root.querySelector("[data-gallery-thumbs]");
    const count = root.querySelector("[data-gallery-count]");
    const navButtons = root.querySelectorAll(".gallery-nav");
    const colorName = root.querySelector("[data-color-name]");
    const swatches = root.querySelectorAll("[data-color-index]");
    const buyButton = root.querySelector("[data-buy]");
    const buyNote = root.querySelector("[data-buy-note]");

    const showImage = (index) => {
      const images = imagesFor(product, color);
      imageIndex = (index + images.length) % images.length;
      const image = images[imageIndex];

      if (mainImage.getAttribute("src") !== image.src) {
        // Fade only when swapping an image already on screen, not on first paint.
        mainImage.classList.toggle("is-loading", Boolean(mainImage.getAttribute("src")));
        mainImage.onload = () => mainImage.classList.remove("is-loading");
        mainImage.src = image.src;
      }

      mainImage.alt = image.alt;
      count.textContent = `${imageIndex + 1} / ${images.length}`;
      thumbs.querySelectorAll("button").forEach((button, buttonIndex) => {
        button.setAttribute("aria-current", String(buttonIndex === imageIndex));
      });
    };

    const renderGallery = () => {
      const images = imagesFor(product, color);
      const many = images.length > 1;

      thumbs.innerHTML = many
        ? images
            .map(
              (image, index) =>
                `<button type="button" aria-label="Show image ${index + 1}" data-thumb="${index}"><img src="${image.src}" alt="" loading="lazy"></button>`
            )
            .join("")
        : "";
      thumbs.hidden = !many;
      count.hidden = !many;
      navButtons.forEach((button) => {
        button.hidden = !many;
      });

      thumbs.querySelectorAll("[data-thumb]").forEach((button) => {
        button.addEventListener("click", () => showImage(Number(button.getAttribute("data-thumb"))));
      });

      showImage(0);
    };

    const renderBuyState = () => {
      const url = checkoutUrlFor(product, color);
      buyButton.disabled = !url;
      // No price yet = not released; a price with no Stripe link = sold out.
      const unavailable = product.price === null ? "Coming soon" : "Out of Stock";
      buyButton.textContent = url ? `Buy now · ${formatPrice(product.price)}` : unavailable;
      buyNote.textContent = url
        ? product.checkoutNote
        : product.price === null
          ? "This one isn't on sale yet. Check back soon."
          : "This one is sold out right now. Check back soon.";
    };

    const selectColor = (index, updateUrl) => {
      color = product.colors[index];
      colorName.textContent = color.name;
      swatches.forEach((swatch, swatchIndex) => {
        swatch.setAttribute("aria-checked", String(swatchIndex === index));
        swatch.tabIndex = swatchIndex === index ? 0 : -1;
      });

      if (updateUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set("color", color.name.toLowerCase().replace(/\s+/g, "-"));
        window.history.replaceState(null, "", url);
      }

      renderGallery();
      renderBuyState();
    };

    swatches.forEach((swatch) => {
      swatch.addEventListener("click", () => selectColor(Number(swatch.getAttribute("data-color-index")), true));
      swatch.addEventListener("keydown", (event) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
        if (!step) {
          return;
        }
        event.preventDefault();
        const next = (product.colors.indexOf(color) + step + product.colors.length) % product.colors.length;
        selectColor(next, true);
        swatches[next].focus();
      });
    });

    root.querySelector("[data-gallery-prev]").addEventListener("click", () => showImage(imageIndex - 1));
    root.querySelector("[data-gallery-next]").addEventListener("click", () => showImage(imageIndex + 1));

    buyButton.addEventListener("click", async () => {
      const checkoutUrl = checkoutUrlFor(product, color);
      if (!checkoutUrl) {
        return;
      }

      const user = await currentUser();

      if (!user) {
        const here = window.location.pathname.split("/").pop() + window.location.search;
        window.location.href = `login.html?next=${encodeURIComponent(here)}`;
        return;
      }

      window.location.href = paymentLinkFor(product, color, user);
    });

    if (color) {
      selectColor(product.colors.indexOf(color), false);
    } else {
      renderGallery();
      renderBuyState();
    }

    renderRelated(product);
  }

  function renderRelated(product) {
    const related = document.querySelector("[data-related]");
    if (!related) {
      return;
    }

    const others = products.filter((item) => item.slug !== product.slug);
    const picks = [
      ...others.filter((item) => item.category === product.category),
      ...others.filter((item) => item.category !== product.category)
    ].slice(0, 3);

    related.innerHTML = picks
      .map((item) => {
        const image = imagesFor(item, item.colors?.[0])[0];
        return `
          <a class="product-card" href="${pageFor(item)}">
            <div class="product-media">
              ${item.price === null ? `<span class="product-flag">Coming soon</span>` : ""}
              <img src="${image.src}" alt="${image.alt}" loading="lazy" width="1200" height="1200">
            </div>
            <div class="product-body">
              <div class="product-meta">
                <span class="label">${item.tag}</span>
                <span class="product-price${item.price === null ? " is-soon" : ""}">${formatPrice(item.price)}</span>
              </div>
              <h3>${item.name}</h3>
              <p>${item.blurb}</p>
              <div class="product-foot">
                <span class="text-link">View <span class="arrow" aria-hidden="true">&rarr;</span></span>
              </div>
            </div>
          </a>`;
      })
      .join("");
  }

  // ---------- Reveal motion ----------

  const revealNodes = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if ("IntersectionObserver" in window && revealNodes.length > 0 && !reduceMotion.matches) {
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("visible"));
  }
})();
