/**
 * CampusCode ReBuild '26 — Student Application Engine
 *
 * Core Engineering Workspace Client
 * Features:
 *   - 3D Rotating Cylindrical Carousel (My Events) with Depth Fade & Flip
 *   - 3D Flip-Clock Countdown (Round 2 Cutoff: 07 Nov 2026, 20:31 IST)
 *   - Horizontal 3-Round Timeline Track (R1 Recreate, R2 Rebuild, R3 Interview)
 *   - Hash Navigation & Floating Pill Bottom Dock
 *   - Real Inline Auth Validation & 3-Step Wizard
 */

// Top Configuration Constants
const STUDENT_NAME = "Avi";
const TEAM_NAME = "Team Stark";
const DEADLINE_IST = "2026-11-07T20:31:00+05:30";

window.STUDENT_NAME = STUDENT_NAME;
window.TEAM_NAME = TEAM_NAME;
window.DEADLINE_IST = DEADLINE_IST;

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initStudentContext();
  initFlipClockCountdown();
  init3DCarousel(prefersReducedMotion);
  initDashboardRouting();
  initEventsFilterAndSearch();
  initProfilePopover();
  initAuthForms();

  const navLinks = document.querySelectorAll(".site-header .nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
});

/* ==========================================================================
   1. Student Context & Telemetry Identity
   ========================================================================== */
function initStudentContext() {
  const studentDisplays = document.querySelectorAll(".display-student-name");
  studentDisplays.forEach(el => { el.textContent = STUDENT_NAME; });

  const teamDisplays = document.querySelectorAll(".display-team-name");
  teamDisplays.forEach(el => { el.textContent = TEAM_NAME; });

  const avatarInitials = document.querySelectorAll(".student-avatar-initials");
  avatarInitials.forEach(el => { el.textContent = STUDENT_NAME.charAt(0).toUpperCase(); });
}

/* ==========================================================================
   2. 3D Flip-Clock Countdown Engine (07 Nov 2026, 20:31:00 IST)
   ========================================================================== */
function initFlipClockCountdown() {
  const daysEl = document.getElementById("flip-val-days");
  const hoursEl = document.getElementById("flip-val-hours");
  const minsEl = document.getElementById("flip-val-mins");
  const secsEl = document.getElementById("flip-val-secs");

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const targetTime = new Date(DEADLINE_IST).getTime();
  let prevDays = "", prevHours = "", prevMins = "", prevSecs = "";
  let timerId = null;

  function updateClock() {
    const now = new Date().getTime();
    const diff = targetTime - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      const statusPill = document.getElementById("flip-clock-status");
      if (statusPill) {
        statusPill.textContent = "Round 2 Concluded";
        statusPill.className = "slash-badge slash-badge-black";
      }
      if (timerId) clearInterval(timerId);
      return;
    }

    const d = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0");
    const h = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
    const m = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
    const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");

    if (d !== prevDays) { daysEl.textContent = d; prevDays = d; }
    if (h !== prevHours) { hoursEl.textContent = h; prevHours = h; }
    if (m !== prevMins) { minsEl.textContent = m; prevMins = m; }
    if (s !== prevSecs) { secsEl.textContent = s; prevSecs = s; }
  }

  updateClock();
  timerId = setInterval(updateClock, 1000);
}

/* ==========================================================================
   3. Rotating 3D Cylindrical Carousel (My Events View)
   ========================================================================== */
function init3DCarousel(reducedMotion) {
  const wheel = document.getElementById("carousel-wheel");
  const cards = document.querySelectorAll(".carousel-card-3d");
  const prevBtn = document.getElementById("carousel-btn-prev");
  const nextBtn = document.getElementById("carousel-btn-next");

  if (!wheel || cards.length === 0) return;

  let currentIndex = 0;
  const totalCards = cards.length; // 3
  const angleStep = 120; // 360 / 3

  function updateCarousel() {
    const targetRot = currentIndex * -angleStep;
    wheel.style.transform = `rotateY(${targetRot}deg)`;

    cards.forEach((card, idx) => {
      let diff = (idx - (currentIndex % totalCards) + totalCards) % totalCards;
      if (diff > 1) diff -= totalCards;

      if (diff === 0) {
        card.style.opacity = "1";
        card.style.filter = "none";
        card.setAttribute("aria-hidden", "false");
        card.style.pointerEvents = "auto";
        card.style.zIndex = "10";
      } else {
        card.style.opacity = "0.32";
        card.style.filter = "blur(1.5px)";
        card.setAttribute("aria-hidden", "true");
        card.style.pointerEvents = "auto";
        card.style.zIndex = "1";
        card.classList.remove("is-flipped");
      }
    });
  }

  function goNext() {
    currentIndex++;
    updateCarousel();
  }

  function goPrev() {
    currentIndex--;
    updateCarousel();
  }

  if (nextBtn) nextBtn.addEventListener("click", goNext);
  if (prevBtn) prevBtn.addEventListener("click", goPrev);

  let startX = 0;
  let isDragging = false;
  let hasDragged = false;

  cards.forEach((card, idx) => {
    card.addEventListener("click", () => {
      if (hasDragged) {
        hasDragged = false;
        return;
      }
      let diff = (idx - (currentIndex % totalCards) + totalCards) % totalCards;
      if (diff > 1) diff -= totalCards;

      if (diff === 0) {
        card.classList.toggle("is-flipped");
      } else {
        currentIndex += diff;
        updateCarousel();
      }
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("is-flipped");
      }
    });
  });

  window.addEventListener("keydown", (e) => {
    if (document.getElementById("view-my-events")?.classList.contains("active")) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    }
  });

  wheel.addEventListener("mousedown", (e) => {
    isDragging = true;
    hasDragged = false;
    startX = e.clientX;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    if (Math.abs(e.clientX - startX) > 8) {
      hasDragged = true;
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = e.clientX - startX;
    if (diffX < -50) goNext();
    else if (diffX > 50) goPrev();
  });

  wheel.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length > 0) {
      isDragging = true;
      hasDragged = false;
      startX = e.touches[0].clientX;
    }
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || !e.touches || !e.touches.length) return;
    if (Math.abs(e.touches[0].clientX - startX) > 8) {
      hasDragged = true;
    }
  }, { passive: true });

  window.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;
    if (!e.changedTouches || !e.changedTouches.length) return;
    const diffX = e.changedTouches[0].clientX - startX;
    if (diffX < -50) goNext();
    else if (diffX > 50) goPrev();
  });

  updateCarousel();
}

/* ==========================================================================
   4. Dashboard Routing & Dock Navigation
   ========================================================================== */
function initDashboardRouting() {
  const dockButtons = document.querySelectorAll(".floating-bottom-dock .dock-item-btn[data-route]");
  const viewPanels = document.querySelectorAll(".dashboard-view-panel");
  const breadcrumbEl = document.getElementById("active-crumb-label");

  if (!viewPanels.length) return;

  function switchView(targetRoute) {
    const route = targetRoute.replace("#", "") || "overview";

    dockButtons.forEach(btn => {
      const btnRoute = btn.getAttribute("data-route");
      if (btnRoute === route) {
        btn.classList.add("active");
        btn.setAttribute("aria-current", "page");
      } else {
        btn.classList.remove("active");
        btn.removeAttribute("aria-current");
      }
    });

    viewPanels.forEach(panel => {
      if (panel.id === `view-${route}`) {
        panel.classList.add("active");
        panel.removeAttribute("hidden");
      } else {
        panel.classList.remove("active");
        panel.setAttribute("hidden", "true");
      }
    });

    if (breadcrumbEl) {
      if (route === "overview") breadcrumbEl.textContent = "Overview Track";
      else if (route === "my-events") breadcrumbEl.textContent = "My Events 3D Carousel";
      else if (route === "events") breadcrumbEl.textContent = "Challenge Arena";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  dockButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const route = btn.getAttribute("data-route");
      if (route && route !== "profile") {
        window.location.hash = `#${route}`;
      }
    });
  });

  window.addEventListener("hashchange", () => {
    const currentHash = window.location.hash.slice(1) || "overview";
    switchView(currentHash);
  });

  const initialHash = window.location.hash.slice(1) || "overview";
  switchView(initialHash);

  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
    if (e.key === "1") { window.location.hash = "#overview"; }
    if (e.key === "2") { window.location.hash = "#my-events"; }
    if (e.key === "3") { window.location.hash = "#events"; }
  });
}

/* ==========================================================================
   5. Explore Events Search & Category Filter
   ========================================================================== */
function initEventsFilterAndSearch() {
  const searchInput = document.getElementById("events-search-input");
  const categoryChips = document.querySelectorAll(".category-chip");
  const exploreCards = document.querySelectorAll(".explore-event-card");
  const emptyStateEl = document.getElementById("events-empty-state");

  if (!exploreCards.length) return;

  let currentCategory = "all";

  function filterExploreCards() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    exploreCards.forEach(card => {
      const title = (card.querySelector(".event-card-title")?.textContent || "").toLowerCase();
      const desc = (card.querySelector(".event-card-desc")?.textContent || "").toLowerCase();
      const category = card.getAttribute("data-category") || "";

      const matchesQuery = !query || title.includes(query) || desc.includes(query);
      const matchesCategory = currentCategory === "all" || category === currentCategory;

      if (matchesQuery && matchesCategory) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (emptyStateEl) {
      emptyStateEl.style.display = visibleCount === 0 ? "flex" : "none";
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterExploreCards);
  }

  categoryChips.forEach(chip => {
    chip.addEventListener("click", () => {
      categoryChips.forEach(c => {
        c.classList.remove("active");
        c.className = "category-chip slash-badge slash-badge-ghost";
      });
      chip.classList.add("active");
      chip.className = "category-chip slash-badge slash-badge-black active";
      currentCategory = chip.getAttribute("data-category") || "all";
      filterExploreCards();
    });
  });

  exploreCards.forEach(card => {
    const regBtn = card.querySelector(".btn-action-register");
    const remindBtn = card.querySelector(".btn-action-remind");

    if (regBtn) {
      regBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (regBtn.classList.contains("is-registered")) {
          regBtn.classList.remove("is-registered");
          regBtn.textContent = "Register";
          regBtn.className = "btn btn-lime btn-sm btn-action-register";
        } else {
          regBtn.classList.add("is-registered");
          regBtn.textContent = "✓ Registered";
          regBtn.className = "btn btn-black btn-sm btn-action-register is-registered";
        }
      });
    }

    if (remindBtn) {
      remindBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (remindBtn.classList.contains("is-active")) {
          remindBtn.classList.remove("is-active");
          remindBtn.textContent = "Remind Me";
        } else {
          remindBtn.classList.add("is-active");
          remindBtn.textContent = "✓ Reminder Set";
        }
      });
    }
  });
}

/* ==========================================================================
   6. Profile Popover Controller
   ========================================================================== */
function initProfilePopover() {
  const profileTrigger = document.getElementById("dock-profile-trigger");
  const popoverModal = document.getElementById("profile-popover");
  const popoverBackdrop = document.getElementById("profile-backdrop");
  const closeBtn = document.getElementById("profile-popover-close");

  if (!profileTrigger || !popoverModal || !popoverBackdrop) return;

  function openProfile() {
    popoverBackdrop.classList.add("is-open");
    popoverModal.classList.add("is-open");
    popoverModal.setAttribute("aria-hidden", "false");
    popoverModal.focus();
  }

  function closeProfile() {
    popoverBackdrop.classList.remove("is-open");
    popoverModal.classList.remove("is-open");
    popoverModal.setAttribute("aria-hidden", "true");
    profileTrigger.focus();
  }

  profileTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    if (popoverModal.classList.contains("is-open")) closeProfile();
    else openProfile();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeProfile);
  popoverBackdrop.addEventListener("click", closeProfile);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popoverModal.classList.contains("is-open")) {
      closeProfile();
    }
  });
}

/* ==========================================================================
   7. Auth Forms: Real Inline Validation & 3-Step Wizard
   ========================================================================== */
function initAuthForms() {
  const togglePassBtns = document.querySelectorAll(".js-toggle-password");
  togglePassBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.closest(".input-with-action")?.querySelector("input");
      if (!input) return;
      if (input.type === "password") {
        input.type = "text";
        btn.textContent = "HIDE";
      } else {
        input.type = "password";
        btn.textContent = "SHOW";
      }
    });
  });

  const demoLoginBtn = document.getElementById("btn-demo-login");
  if (demoLoginBtn) {
    demoLoginBtn.addEventListener("click", () => {
      const emailInput = document.getElementById("login-email");
      const passInput = document.getElementById("login-password");
      if (emailInput) emailInput.value = "avi.stark@campuscode.dev";
      if (passInput) passInput.value = "••••••••••••";
      demoLoginBtn.textContent = "Authenticating...";
      setTimeout(() => {
        window.location.href = "dashboard.html#overview";
      }, 400);
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email");
      const pass = document.getElementById("login-password");
      const passWrapper = pass ? pass.closest(".input-with-action") : null;
      let valid = true;

      if (!email.value || !email.value.includes("@")) {
        email.classList.add("is-invalid");
        valid = false;
      } else {
        email.classList.remove("is-invalid");
        email.classList.add("is-valid");
      }

      if (!pass.value || pass.value.length < 6) {
        pass.classList.add("is-invalid");
        if (passWrapper) passWrapper.classList.add("is-invalid");
        valid = false;
      } else {
        pass.classList.remove("is-invalid");
        if (passWrapper) passWrapper.classList.remove("is-invalid");
        pass.classList.add("is-valid");
      }

      if (valid) {
        window.location.href = "dashboard.html#overview";
      }
    });
  }

  const regForm = document.getElementById("register-wizard-form");
  if (regForm) {
    let currentStep = 1;
    const step1 = document.getElementById("wizard-step-1");
    const step2 = document.getElementById("wizard-step-2");
    const step3 = document.getElementById("wizard-step-3");
    const successState = document.getElementById("wizard-success-state");

    const track1 = document.getElementById("step-track-1");
    const track2 = document.getElementById("step-track-2");
    const track3 = document.getElementById("step-track-3");

    const next1 = document.getElementById("btn-next-step-1");
    const next2 = document.getElementById("btn-next-step-2");
    const back2 = document.getElementById("btn-back-step-2");
    const back3 = document.getElementById("btn-back-step-3");

    function setStep(stepNum) {
      currentStep = stepNum;
      [step1, step2, step3].forEach((s, idx) => {
        if (s) s.style.display = (idx + 1 === stepNum) ? "block" : "none";
      });

      if (track1 && track2 && track3) {
        track1.className = stepNum >= 1 ? (stepNum > 1 ? "wizard-bar-segment completed" : "wizard-bar-segment active") : "wizard-bar-segment";
        track2.className = stepNum >= 2 ? (stepNum > 2 ? "wizard-bar-segment completed" : "wizard-bar-segment active") : "wizard-bar-segment";
        track3.className = stepNum >= 3 ? "wizard-bar-segment active" : "wizard-bar-segment";
      }
    }

    if (next1) {
      next1.addEventListener("click", () => {
        const nameInput = document.getElementById("reg-name");
        const collegeInput = document.getElementById("reg-college");
        let valid = true;

        if (!nameInput.value.trim()) { nameInput.classList.add("is-invalid"); valid = false; }
        else { nameInput.classList.remove("is-invalid"); nameInput.classList.add("is-valid"); }

        if (!collegeInput.value.trim()) { collegeInput.classList.add("is-invalid"); valid = false; }
        else { collegeInput.classList.remove("is-invalid"); collegeInput.classList.add("is-valid"); }

        if (valid) setStep(2);
      });
    }

    if (next2) {
      next2.addEventListener("click", () => {
        const emailInput = document.getElementById("reg-email");
        const passInput = document.getElementById("reg-password");
        const passWrapper = passInput ? passInput.closest(".input-with-action") : null;
        let valid = true;

        if (!emailInput.value.includes("@")) { emailInput.classList.add("is-invalid"); valid = false; }
        else { emailInput.classList.remove("is-invalid"); emailInput.classList.add("is-valid"); }

        if (passInput.value.length < 6) {
          passInput.classList.add("is-invalid");
          if (passWrapper) passWrapper.classList.add("is-invalid");
          valid = false;
        } else {
          passInput.classList.remove("is-invalid");
          if (passWrapper) passWrapper.classList.remove("is-invalid");
          passInput.classList.add("is-valid");
        }

        if (valid) setStep(3);
      });
    }

    if (back2) back2.addEventListener("click", () => setStep(1));
    if (back3) back3.addEventListener("click", () => setStep(2));

    regForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (currentStep === 1) {
        if (next1) next1.click();
        return;
      }
      if (currentStep === 2) {
        if (next2) next2.click();
        return;
      }

      const rulesCheck = document.getElementById("reg-rules-check");
      const ageCheck = document.getElementById("reg-age-check");

      if (rulesCheck && !rulesCheck.checked) {
        alert("Please accept the Arena Rules and Code of Conduct.");
        return;
      }
      if (ageCheck && !ageCheck.checked) {
        alert("You must confirm you are an active student aged 18+.");
        return;
      }

      if (step3) step3.style.display = "none";
      if (track3) track3.className = "wizard-bar-segment completed";
      if (successState) successState.style.display = "block";

      setTimeout(() => {
        window.location.href = "dashboard.html#overview";
      }, 1000);
    });
  }
}
