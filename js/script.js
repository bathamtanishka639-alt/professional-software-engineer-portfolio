/* ============================================================================
   TANISHKA BATHAM — PORTFOLIO SCRIPTS
   Modern ES6 JavaScript · Clean, modular, & dependency-free.
   ========================================================================== */

(() => {
  "use strict";

  const root = document.documentElement;
  const nav = document.getElementById("nav");
  const navPanel = document.getElementById("navPanel");
  const menuBtn = document.getElementById("menuBtn");
  const toTop = document.getElementById("toTop");
  const toast = document.getElementById("toast");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- 1. THEME */
  const themeButtons = [
    document.getElementById("themeToggle"),
    document.getElementById("themeToggleMobile")
  ].filter(Boolean);
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeMeta) {
      themeMeta.setAttribute("content", theme === "dark" ? "#0e1013" : "#f7f4ee");
    }
    themeButtons.forEach((btn) => {
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    });
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      /* private mode fallback */
    }
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  });

  /* ------------------------------------------------- 2. NAV STATE + HAMBURGER */
  function setMenu(open) {
    if (!navPanel || !menuBtn) return;
    navPanel.classList.toggle("is-open", open);
    menuBtn.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      setMenu(!navPanel.classList.contains("is-open"));
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1180) setMenu(false);
  });

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle("is-scrolled", y > 12);
    if (toTop) toTop.classList.toggle("is-visible", y > 480);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------- 3. SMOOTH SCROLLING */
  function headerOffset() {
    return nav ? nav.offsetHeight + 14 : 80;
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest ? e.target.closest("a[href]") : null;
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.charAt(0) !== "#") return;

    if (href === "#" && link.hasAttribute("data-placeholder")) return;
    if (href === "#") {
      e.preventDefault();
      return;
    }

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    setMenu(false);

    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
    window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? "auto" : "smooth" });

    try {
      history.pushState(null, "", href);
    } catch {
      /* ignore */
    }
  });

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------- 4. ACTIVE SECTION HIGHLIGHT */
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === id;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => spy.observe(section));
  }

  /* -------------------------------------------------- 5. REVEAL ON SCROLL */
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  revealItems.forEach((el) => {
    const delay = el.getAttribute("data-delay");
    if (delay) el.style.setProperty("--d", delay + "ms");
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    revealItems.forEach((el) => revealer.observe(el));
  }

  /* ------------------------------------------------------- 6. FILTERING */
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const name = group.getAttribute("data-filter-group");
    const body = group.closest(".section__body");
    const controls = body ? body.querySelector(".filters") : null;
    const empty = body ? body.querySelector(`[data-empty="${name}"]`) : null;
    if (!controls) return;

    const buttons = controls.querySelectorAll(".filter");
    const items = group.children;

    controls.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter");
      if (!btn) return;

      const value = btn.getAttribute("data-filter");
      let shown = 0;

      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });

      Array.from(items).forEach((item) => {
        const match = value === "all" || item.getAttribute("data-category") === value;
        item.classList.toggle("is-hidden", !match);
        if (match) {
          item.classList.add("is-visible");
          shown += 1;
        }
      });

      if (empty) empty.hidden = shown > 0;
    });
  });

  /* ------------------------------------------------ 7. PLACEHOLDER LINKS */
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3400);
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest ? e.target.closest("[data-placeholder]") : null;
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const unfilled = href === "#" || href.includes("[");
    if (!unfilled) return;

    e.preventDefault();
    showToast(link.getAttribute("data-placeholder") + " link hasn't been added yet.");
  });

  /* ------------------------------------------------ 8. IMAGE FALLBACK */
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    const fail = () => {
      const frame = img.closest(".portrait__frame");
      if (frame) frame.classList.add("is-missing");
    };
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ----------------------------------------------------- 9. CONTACT FORM */
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (formStatus) {
        formStatus.textContent =
          "Thank you for your message! Your form has been submitted.";
      }
      form.reset();
    });
  }

  /* ------------------------------------------------ 10. DYNAMIC CERTIFICATE UPLOAD */
  const openModalBtn = document.getElementById("open-cert-modal-btn");
  const closeModalBtn = document.getElementById("close-cert-modal-btn");
  const cancelModalBtn = document.getElementById("cancel-cert-modal-btn");
  const modalBackdrop = document.getElementById("cert-modal-backdrop");
  const uploadForm = document.getElementById("cert-upload-form");
  const fileInput = document.getElementById("cert-file-input");
  const dropzone = document.getElementById("file-dropzone");
  const dropzonePrompt = document.getElementById("dropzone-prompt");
  const fileSelectedInfo = document.getElementById("file-selected-info");
  const fileNameDisplay = document.getElementById("file-name-display");
  const fileRemoveBtn = document.getElementById("file-remove-btn");
  const certGrid = document.querySelector('.cert-grid[data-filter-group="certificates"]');

  let currentFileDataUrl = "";

  function openCertModal() {
    if (!modalBackdrop) return;
    modalBackdrop.hidden = false;
    setTimeout(() => {
      modalBackdrop.classList.add("is-open");
    }, 10);
    document.body.style.overflow = "hidden";
  }

  function closeCertModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("is-open");
    setTimeout(() => {
      modalBackdrop.hidden = true;
      document.body.style.overflow = "";
      resetUploadForm();
    }, 250);
  }

  function resetUploadForm() {
    if (uploadForm) uploadForm.reset();
    currentFileDataUrl = "";
    if (dropzonePrompt) dropzonePrompt.hidden = false;
    if (fileSelectedInfo) fileSelectedInfo.hidden = true;
  }

  if (openModalBtn) openModalBtn.addEventListener("click", openCertModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeCertModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener("click", closeCertModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeCertModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalBackdrop.classList.contains("is-open")) {
        closeCertModal();
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener("change", () => {
      if (fileInput.files && fileInput.files[0]) {
        handleSelectedFile(fileInput.files[0]);
      }
    });
  }

  if (dropzone) {
    ["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add("is-dragover");
      });
    });
    ["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove("is-dragover");
      });
    });
    dropzone.addEventListener("drop", (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        fileInput.files = e.dataTransfer.files;
        handleSelectedFile(e.dataTransfer.files[0]);
      }
    });
  }

  if (fileRemoveBtn) {
    fileRemoveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      resetUploadForm();
    });
  }

  function handleSelectedFile(file) {
    if (fileNameDisplay) fileNameDisplay.textContent = file.name;
    if (dropzonePrompt) dropzonePrompt.hidden = true;
    if (fileSelectedInfo) fileSelectedInfo.hidden = false;

    const reader = new FileReader();
    reader.onload = (e) => {
      currentFileDataUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function createCertElement(data) {
    const article = document.createElement("article");
    article.className = "cert reveal is-visible";
    article.setAttribute("data-category", data.category);

    let categoryLabel = data.category.charAt(0).toUpperCase() + data.category.slice(1);
    if (data.category === "web") categoryLabel = "Web Development";
    if (data.category === "ai") categoryLabel = "AI/ML";
    if (data.category === "security") categoryLabel = "Cybersecurity";
    if (data.category === "dsa") categoryLabel = "DSA";

    let previewHtml = "";
    if (data.fileDataUrl && data.fileDataUrl.startsWith("data:image/")) {
      previewHtml = `<a href="${data.fileDataUrl}" target="_blank" rel="noopener noreferrer" title="View Certificate"><img src="${data.fileDataUrl}" alt="${data.name}" loading="lazy"></a>`;
    } else if (data.fileDataUrl && data.fileDataUrl.startsWith("data:application/pdf")) {
      previewHtml = `<a href="${data.fileDataUrl}" target="_blank" rel="noopener noreferrer" title="View Certificate PDF"><div style="padding: 24px; text-align: center; background: var(--surface-2); border-radius: 4px; aspect-ratio: 16/10; display: flex; flex-direction: column; align-items: center; justify-content: center;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg><p style="margin-top: 8px; font-size: 13px; font-weight: 500; color: var(--ink);">${data.name} (PDF)</p></div></a>`;
    } else {
      previewHtml = `<a href="${data.fileDataUrl || "#"}" target="_blank" rel="noopener noreferrer"><div style="padding: 24px; text-align: center; background: var(--surface-2); border-radius: 4px; aspect-ratio: 16/10; display: flex; align-items: center; justify-content: center;"><p style="font-size: 13px; color: var(--ink);">${data.name}</p></div></a>`;
    }

    let metaListHtml = `<div><dt>Issued by</dt><dd>${data.org}</dd></div>`;
    if (data.date) {
      metaListHtml += `<div><dt>Date</dt><dd>${data.date}</dd></div>`;
    }
    if (data.id) {
      metaListHtml += `<div><dt>Credential ID</dt><dd>${data.id}</dd></div>`;
    }

    let actionsHtml = `<a class="btn btn--ghost btn--sm" href="${data.fileDataUrl || "#"}" target="_blank" rel="noopener noreferrer">View Certificate</a>`;
    if (data.verifyUrl) {
      actionsHtml += `<a class="btn btn--ghost btn--sm" href="${data.verifyUrl}" target="_blank" rel="noopener noreferrer">Verify Credential</a>`;
    }
    actionsHtml += `<button class="btn btn--ghost btn--sm cert-delete-btn" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.3);" type="button">Remove</button>`;

    article.innerHTML = `
      <div class="cert__preview">${previewHtml}</div>
      <div class="cert__body">
        <p class="cert__cat">${categoryLabel}</p>
        <h3 class="cert__name">${data.name}</h3>
        <dl class="meta-list">${metaListHtml}</dl>
        <div class="cert__actions">${actionsHtml}</div>
      </div>`;

    const deleteBtn = article.querySelector(".cert-delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        article.remove();
        try {
          const saved = JSON.parse(localStorage.getItem("user_uploaded_certificates") || "[]");
          const updated = saved.filter((item) => item.name !== data.name && item.id !== data.id);
          localStorage.setItem("user_uploaded_certificates", JSON.stringify(updated));
          showToast("Certificate removed.");
        } catch {
          /* ignore */
        }
      });
    }

    return article;
  }

  function loadSavedCertificates() {
    try {
      const saved = localStorage.getItem("user_uploaded_certificates");
      if (saved && certGrid) {
        const items = JSON.parse(saved);
        const filteredItems = items.filter((item) => {
          const name = (item.name || "").toLowerCase();
          const id = (item.id || "").toLowerCase();
          return !name.includes("vicodathon") && !name.includes("ab talks") && id !== "abt-hk-mjrku";
        });
        localStorage.setItem("user_uploaded_certificates", JSON.stringify(filteredItems));
        filteredItems.forEach((item) => {
          const el = createCertElement(item);
          certGrid.appendChild(el);
        });
      }
    } catch (err) {
      console.error("Could not load stored certificates:", err);
    }
  }

  loadSavedCertificates();

  if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("cert-name-input").value.trim();
      const org = document.getElementById("cert-org-input").value.trim();
      const category = document.getElementById("cert-category-input").value;
      const date = document.getElementById("cert-date-input").value.trim();
      const id = document.getElementById("cert-id-input").value.trim();
      const verifyUrl = document.getElementById("cert-verify-input").value.trim();

      if (!name || !org || !currentFileDataUrl) {
        showToast("Please select a certificate file and fill required fields.");
        return;
      }

      const certData = {
        name,
        org,
        category,
        date,
        id,
        verifyUrl,
        fileDataUrl: currentFileDataUrl
      };

      if (certGrid) {
        const newEl = createCertElement(certData);
        certGrid.appendChild(newEl);
      }

      try {
        const saved = JSON.parse(localStorage.getItem("user_uploaded_certificates") || "[]");
        saved.push(certData);
        localStorage.setItem("user_uploaded_certificates", JSON.stringify(saved));
      } catch (err) {
        console.warn("Storage limit reached or unavailable:", err);
      }

      showToast(`Certificate '${name}' added successfully!`);
      closeCertModal();
    });
  }

  /* --------------------------------------------------- RESUME MODAL HANDLER */
  const resumeBackdrop = document.getElementById("resume-modal-backdrop");
  const closeResumeBtn = document.getElementById("close-resume-modal-btn");
  const directResumeDownloadBtn = document.getElementById("direct-resume-download-btn");
  const copyResumeUrlBtn = document.getElementById("copy-resume-url-btn");

  function openResumeModal() {
    if (resumeBackdrop) {
      resumeBackdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeResumeModal() {
    if (resumeBackdrop) {
      resumeBackdrop.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest ? e.target.closest(".open-resume-modal-btn") : null;
    if (trigger) {
      e.preventDefault();
      openResumeModal();
    }
  });

  if (closeResumeBtn) {
    closeResumeBtn.addEventListener("click", closeResumeModal);
  }

  if (resumeBackdrop) {
    resumeBackdrop.addEventListener("click", (e) => {
      if (e.target === resumeBackdrop) {
        closeResumeModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && resumeBackdrop && resumeBackdrop.classList.contains("is-open")) {
      closeResumeModal();
    }
  });

  if (directResumeDownloadBtn) {
    directResumeDownloadBtn.addEventListener("click", () => {
      showToast("Downloading Tanishka Batham's Resume (PDF)...");
    });
  }

  if (copyResumeUrlBtn) {
    copyResumeUrlBtn.addEventListener("click", () => {
      const fullUrl = `${window.location.origin}/assets/resume/Tanishka_Batham_Resume.pdf`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullUrl).then(() => {
          showToast("Resume PDF link copied to clipboard!");
        }).catch(() => {
          showToast(`Resume link: ${fullUrl}`);
        });
      } else {
        showToast(`Resume link: ${fullUrl}`);
      }
    });
  }

  /* --------------------------------------------------------- INITIAL STATE */
  const savedTheme = localStorage.getItem("portfolio-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
  applyTheme(initialTheme);
})();
