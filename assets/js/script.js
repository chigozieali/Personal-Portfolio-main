'use strict';

/**
 * Small helper that toggles the `.active` class on an element.
 */
const elementToggleFunc = function (elem) {
  if (elem) elem.classList.toggle("active");
};

/**
 * Tracks the element that was focused before a modal opened,
 * so focus can be restored when it closes.
 */
let lastFocused = null;

/**
 * Closes any open modal container.
 */
const closeModals = function () {
  document.querySelectorAll(".modal-container.active").forEach(function (container) {
    container.classList.remove("active");
    const overlay = container.querySelector(".overlay");
    if (overlay) overlay.classList.remove("active");
  });
  if (lastFocused) lastFocused.focus();
  lastFocused = null;
};

/**
 * Opens a modal container, saving the previously focused element.
 */
const openModal = function (container) {
  if (!container) return;
  lastFocused = document.activeElement;
  container.classList.add("active");
  const overlay = container.querySelector(".overlay");
  if (overlay) overlay.classList.add("active");
  const closeBtn = container.querySelector("[data-modal-close-btn],[data-project-modal-close-btn]");
  if (closeBtn) closeBtn.focus();
};

// Close modals with the Escape key.
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeModals();
});

/* =====================================================================
 * SIDEBAR
 * ===================================================================== */
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
    const span = sidebarBtn.querySelector("span");
    if (span && sidebar.classList.contains("active")) {
      span.textContent = "Hide Contacts";
    } else if (span) {
      span.textContent = "Show Contacts";
    }
  });
}

/* =====================================================================
 * TESTIMONIALS MODAL
 * ===================================================================== */
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

if (testimonialsItem.length && modalContainer && overlay && modalImg && modalTitle && modalText) {
  testimonialsItem.forEach(function (item) {
    item.addEventListener("click", function () {
      const avatar = this.querySelector("[data-testimonials-avatar]");
      const title = this.querySelector("[data-testimonials-title]");
      const text = this.querySelector("[data-testimonials-text]");
      if (!avatar || !title || !text) return;

      modalImg.src = avatar.src;
      modalImg.alt = avatar.alt;
      modalTitle.textContent = title.textContent;
      modalText.innerHTML = text.innerHTML;
      openModal(modalContainer);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModals);
  if (overlay) overlay.addEventListener("click", closeModals);
}

/* =====================================================================
 * PROJECT MODAL
 * ===================================================================== */
const projectItems = document.querySelectorAll(".project-card");
const projectModalContainer = document.querySelector("[data-project-modal-container]");

// Assign project numbers automatically from the DOM order, so the
// number always matches the visible sequence.
document.querySelectorAll(".project-list .project-item[data-filter-item]").forEach(function (item, index) {
  const projectNum = item.querySelector(".project-num");
  if (projectNum) projectNum.textContent = String(index + 1).padStart(2, "0");
});

const projectModalCloseBtn = document.querySelector("[data-project-modal-close-btn]");
const projectModalOverlay = document.querySelector("[data-project-modal-overlay]");
const projectModalTitle = document.querySelector("[data-project-modal-title]");
const projectModalStatus = document.querySelector("[data-project-modal-status]");
const projectModalDescription = document.querySelector("[data-project-modal-description]");
const projectModalTags = document.querySelector("[data-project-modal-tags]");
const projectModalDate = document.querySelector("[data-project-modal-date]");
const projectModalLink = document.querySelector("[data-project-modal-link]");

if (projectItems.length && projectModalContainer) {
  projectItems.forEach(function (card) {
    // Make keyboard users able to open the project modal.
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-haspopup", "dialog");

    const openProjectModal = function () {
      const projectItem = card.closest(".project-item");
      const title = card.querySelector(".project-title");
      const status = card.querySelector(".project-status");
      const date = card.querySelector(".project-date");
      const repoUrl = projectItem ? projectItem.dataset.repo || "" : "";
      const tags = projectItem && projectItem.dataset.tags ? projectItem.dataset.tags.split(",") : [];

      if (projectModalTitle) projectModalTitle.textContent = title ? title.textContent : "";
      if (projectModalStatus) projectModalStatus.textContent = status ? status.textContent : "";
      if (projectModalDescription) {
        projectModalDescription.textContent = projectItem ? projectItem.dataset.description || "" : "";
      }
      if (projectModalDate) projectModalDate.textContent = date ? date.textContent : "";
      if (projectModalTags) {
        projectModalTags.innerHTML = tags.map(function (tag) {
          return `<span class="project-tag">${tag.trim()}</span>`;
        }).join("");
      }

      if (repoUrl && projectModalLink) {
        projectModalLink.href = repoUrl;
        projectModalLink.classList.remove("hidden");
      } else if (projectModalLink) {
        projectModalLink.href = "#";
        projectModalLink.classList.add("hidden");
      }

      openModal(projectModalContainer);
    };

    card.addEventListener("click", function (event) {
      if (event.target.closest("a")) return;
      openProjectModal();
    });

    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProjectModal();
      }
    });
  });

  if (projectModalCloseBtn) projectModalCloseBtn.addEventListener("click", closeModals);
  if (projectModalOverlay) projectModalOverlay.addEventListener("click", closeModals);
}

/* =====================================================================
 * PROJECT FILTER (mobile select + desktop buttons)
 * ===================================================================== */
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  const normalizedValue = selectedValue.toLowerCase();

  filterItems.forEach(function (item) {
    const itemCategory = (item.dataset.category || "").toLowerCase();
    if (normalizedValue === "all" || normalizedValue === itemCategory) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
};

if (select && selectValue) {
  select.addEventListener("click", function () { elementToggleFunc(this); });

  selectItems.forEach(function (item) {
    item.addEventListener("click", function () {
      const selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  });
}

if (filterBtn.length) {
  let lastClickedBtn = null;

  filterBtn.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      if (lastClickedBtn) lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });
}

/* =====================================================================
 * CONTACT FORM
 * ===================================================================== */
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formBtnText = formBtn ? formBtn.querySelector("span") : null;
const formStatus = document.querySelector("#form-status");

const setFormStatus = function (message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.setAttribute("data-type", type || "info");
};

const refreshFormState = function () {
  if (!form || !formBtn) return;
  if (form.checkValidity()) {
    formBtn.removeAttribute("disabled");
  } else {
    formBtn.setAttribute("disabled", "");
  }
};

if (form && formBtn && formInputs.length) {
  refreshFormState();

  formInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      this.classList.remove("invalid");
      refreshFormState();
      if (formStatus) formStatus.textContent = "";
    });
  });

  form.addEventListener("submit", function (event) {
    // Native validation UI is disabled (novalidate), so we validate manually.
    if (!form.checkValidity()) {
      event.preventDefault();
      formInputs.forEach(function (input) {
        if (!input.checkValidity()) input.classList.add("invalid");
      });
      setFormStatus("Please fill in all required fields before sending.", "error");
      return;
    }

    formBtn.setAttribute("disabled", "");
    if (formBtnText) formBtnText.textContent = "Sending…";
    setFormStatus("Thanks! Sending your message…", "info");
  });
}

/* =====================================================================
 * PAGE NAVIGATION
 * ===================================================================== */
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

const activatePage = function (pageName) {
  let matched = false;

  pages.forEach(function (page) {
    if (page.dataset.page === pageName) {
      page.classList.add("active");
      matched = true;
    } else {
      page.classList.remove("active");
    }
  });

  navigationLinks.forEach(function (link) {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
    if (link.textContent.trim().toLowerCase() === pageName) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  return matched;
};

if (navigationLinks.length) {
  navigationLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      const pageName = this.textContent.trim().toLowerCase();
      const active = activatePage(pageName);

      if (active) {
        history.replaceState(null, "", "#" + pageName.replace(" ", "-"));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", function () {
  // Only activate a page on the real portfolio (index). The 404 page keeps
  // its single article visible by leaving it untouched.
  if (!navigationLinks.length) return;

  const rawHash = window.location.hash.replace("#", "").toLowerCase().replace("-", " ");
  const currentNav = document.querySelector("[data-nav-link].active");
  const defaultPage = currentNav ? currentNav.textContent.trim().toLowerCase() : "about";
  const currentPage = rawHash || defaultPage;

  activatePage(currentPage);

  if (rawHash) {
    const target = document.getElementById(rawHash.replace(" ", "-"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }
});

/* =====================================================================
 * SCROLL REVEAL (subtle)
 * ===================================================================== */
const revealTargets = document.querySelectorAll(".service-item, .skill-chip, .cert-row, .timeline-item, .resource-item");

if (revealTargets.length && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}