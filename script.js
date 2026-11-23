/* ========================================
   Besim Bexom Portföy - JavaScript
   ======================================== */

(function () {
  "use strict";

  // ---------- Yıl ----------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Header scroll ----------
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // ---------- Mobil menü ----------
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // ---------- Filtreleme (Çalışmalar - kategori bazlı) ----------
  const filterBtns = document.querySelectorAll(".filter-btn");
  const workCards = document.querySelectorAll(".work-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const filter = btn.getAttribute("data-filter");

      workCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("hide");
          requestAnimationFrame(() => {
            card.style.display = "flex";
            requestAnimationFrame(() => {
              card.style.opacity = "1";
              card.style.transform = "scale(1)";
            });
          });
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.classList.add("hide");
          }, 300);
        }
      });
    });
  });


  // ---------- Çalışmalar: görselleri kesmeden kendi oranında göster ----------
  // Her kartın genişliği, görselin en/boy oranıyla orantılı verilir;
  // böylece aynı satırdaki görseller aynı yükseklikte yan yana dizilir.
  const ROW_HEIGHT = { "dikey-grid": 380, "kare-grid": 320, "yatay-grid": 185 };

  document.querySelectorAll(".works-grid").forEach((grid) => {
    const key = Object.keys(ROW_HEIGHT).find((k) => grid.classList.contains(k)) || "dikey-grid";
    const rowH = ROW_HEIGHT[key];

    grid.querySelectorAll(".work-card").forEach((card) => {
      const img = card.querySelector("img");
      const media = card.querySelector(".work-media");
      if (!img || !media) return;

      const apply = () => {
        if (!img.naturalWidth || !img.naturalHeight) return;
        const ratio = img.naturalWidth / img.naturalHeight;
        media.style.aspectRatio = img.naturalWidth + " / " + img.naturalHeight;
        card.style.flex = ratio + " 1 " + Math.round(ratio * rowH) + "px";
        card.style.maxWidth = Math.round(ratio * rowH * 1.35) + "px";
      };

      if (img.complete) apply();
      img.addEventListener("load", apply);
    });
  });

  // ---------- Lightbox (Detay) ----------
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
  };

  document.querySelectorAll(".work-card").forEach((card) => {
    card.style.cursor = "zoom-in";
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const img = card.querySelector("img");
      if (!img || !lightbox) return;
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("lightbox-close")) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  // ---------- Kaydırmada görünürlük animasyonu ----------
  const observerOptions = {
    threshold: 0.12,
    rootMargin: "0px 0px -60px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  window.addEventListener("load", () => {
    document.querySelectorAll(".reveal").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80 && rect.bottom >= 0) {
        el.classList.add("active");
      }
    });
  });
})();
