/**
 * CampusCode ReBuild '26 — Student Application Engine
 *
 * Student Developer Workspace & Competition Arena
 * Features:
 *   - Cursor-Following Lime Slash Highlight (rAF Lerp)
 *   - 3D Rotating Cylindrical Carousel (My Events) with Depth Fade & Flip
 *   - 3D IST Flip-Clock Countdown (Round 2 Cutoff: 07 Nov 2026, 20:31 IST)
 *   - Horizontal 3-Round Timeline Track (R1 Recreate, R2 Rebuild, R3 Interview)
 *   - Slab-Wipe Hash Navigation & Floating Bottom Dock
 *   - Real Inline Auth Validation & 3-Step Wizard
 */

// ==========================================================================
// TOP CONFIGURATION CONSTANTS (ReBuild '26 Core Specification)
// ==========================================================================
const STUDENT_NAME = "Avi";
const TEAM_NAME = "Team Stark";
const DEADLINE_IST = "2026-11-07T20:31:00+05:30";

window.STUDENT_NAME = STUDENT_NAME;
window.TEAM_NAME = TEAM_NAME;
window.DEADLINE_IST = DEADLINE_IST;

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initCursorSlash(prefersReducedMotion);
  initStudentContext();
  initFlipClockCountdown();
  initHeroSlabs3D(prefersReducedMotion);
  init3DCarousel(prefersReducedMotion);
  initDashboardRouting();
  initEventsFilterAndSearch();
  initProfilePopover();
  initAuthForms();
});

/* ==========================================================================
   1. Cursor-Following Lime Slash Highlight (rAF Smoothed)
   ========================================================================== */
function initCursorSlash(reducedMotion) {
  if (reducedMotion) return;

  let cursorSlash = document.getElementById("cursor-slash");
  if (!cursorSlash) {
    cursorSlash = document.createElement("div");
    cursorSlash.id = "cursor-slash";
    document.body.appendChild(cursorSlash);
  }

  let targetX = -100, targetY = -100;
  let curX = -100, curY = -100;
  let isMoving = false;
  let rAFId = null;

  function renderCursor() {
    curX += (targetX - curX) * 0.22;
    curY += (targetY - curY) * 0.22;

    cursorSlash.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) rotate(-15deg)`;

    if (isMoving || Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1) {
      rAFId = requestAnimationFrame(renderCursor);
    } else {
      cancelAnimationFrame(rAFId);
      rAFId = null;
    }
  }

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    cursorSlash.style.opacity = "1";

    if (!rAFId) {
      isMoving = true;
      rAFId = requestAnimationFrame(renderCursor);
    }
  });

  window.addEventListener("mouseleave", () => {
    cursorSlash.style.opacity = "0";
    isMoving = false;
  });
}

/* ==========================================================================
   2. Student Context & Telemetry Identity
   ========================================================================== */
function initStudentContext() {
  const greetingEl = document.getElementById("student-greeting-text");
  if (greetingEl) {
    greetingEl.textContent = `Welcome back, ${STUDENT_NAME}`;
  }

  const studentDisplays = document.querySelectorAll(".display-student-name");
  studentDisplays.forEach(el => { el.textContent = STUDENT_NAME; });

  const teamDisplays = document.querySelectorAll(".display-team-name");
  teamDisplays.forEach(el => { el.textContent = TEAM_NAME; });

  const avatarInitials = document.querySelectorAll(".student-avatar-initials");
  avatarInitials.forEach(el => { el.textContent = STUDENT_NAME.charAt(0).toUpperCase(); });
}

/* ==========================================================================
   3. 3D Flip-Clock Countdown Engine (07 Nov 2026, 20:31:00 IST)
   ========================================================================== */
function initFlipClockCountdown() {
  const daysEl = document.getElementById("flip-val-days");
  const hoursEl = document.getElementById("flip-val-hours");
  const minsEl = document.getElementById("flip-val-mins");
  const secsEl = document.getElementById("flip-val-secs");

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const targetTime = new Date(DEADLINE_IST).getTime();
  let prevDays = "", prevHours = "", prevMins = "", prevSecs = "";

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
        statusPill.textContent = "ROUND 2 CONCLUDED";
        statusPill.className = "slash-badge slash-badge-black";
      }
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
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   4. Hero 3D Skewed Slabs (Staggered Entrance & Scroll Z-Depth Drift)
   ========================================================================== */
function initHeroSlabs3D(reducedMotion) {
  const slabBlack = document.getElementById("slab-black");
  const slabPurple = document.getElementById("slab-purple");
  const slabLime = document.getElementById("slab-lime");

  if (!slabBlack || !slabPurple || !slabLime || reducedMotion) return;

  // Staggered entrance
  setTimeout(() => { slabBlack.style.opacity = "1"; }, 80);
  setTimeout(() => { slabPurple.style.opacity = "1"; }, 220);
  setTimeout(() => { slabLime.style.opacity = "1"; }, 380);

  // Parallax z-drift on scroll
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (scrolled < 900) {
          const depthMultiplier = scrolled * 0.2;
          slabBlack.style.transform = `translateZ(${0 - depthMultiplier * 0.5}px)`;
          slabPurple.style.transform = `translateZ(${50 + depthMultiplier * 0.8}px)`;
          slabLime.style.transform = `translateZ(${100 + depthMultiplier * 1.5}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   5. Rotating 3D Cylindrical Carousel (My Events View)
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

    // Update depth fade and scale for each card
    cards.forEach((card, idx) => {
      // Calculate normalized relative position (-1, 0, 1)
      let diff = (idx - (currentIndex % totalCards) + totalCards) % totalCards;
      if (diff > 1) diff -= totalCards;

      if (diff === 0) {
        // Front Active Card
        card.style.opacity = "1";
        card.style.filter = "none";
        card.setAttribute("aria-hidden", "false");
        card.style.pointerEvents = "auto";
        card.style.zIndex = "10";
      } else {
        // Back / Side Cards (Depth Fade)
        card.style.opacity = "0.35";
        card.style.filter = "blur(1.5px)";
        card.setAttribute("aria-hidden", "true");
        card.style.pointerEvents = "none";
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

  // Card click: If front card -> flip; if side card -> rotate to front
  cards.forEach((card, idx) => {
    card.addEventListener("click", () => {
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

  // Keyboard navigation when in My Events view
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

  // Touch / Mouse Drag Gesture on Carousel
  let startX = 0;
  let isDragging = false;

  wheel.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = e.clientX - startX;
    if (diffX < -50) goNext();
    else if (diffX > 50) goPrev();
  });

  updateCarousel();
}

/* ==========================================================================
   6. Dashboard Slab-Wipe Transition & Hash Routing
   ========================================================================== */
function initDashboardRouting() {
  const dockButtons = document.querySelectorAll(".dock-item-btn[data-route]");
  const viewPanels = document.querySelectorAll(".dashboard-view-panel");
  const breadcrumbEl = document.getElementById("active-crumb-label");
  const wipeOverlay = document.getElementById("slab-wipe-overlay");

  if (!viewPanels.length || !dockButtons.length) return;

  function switchView(targetRoute, triggerWipe = true) {
    const route = targetRoute.replace("#", "") || "overview";

    if (triggerWipe && wipeOverlay) {
      wipeOverlay.classList.add("is-wiping");
      setTimeout(() => {
        applyActiveView(route);
        setTimeout(() => {
          wipeOverlay.classList.remove("is-wiping");
        }, 220);
      }, 180);
    } else {
      applyActiveView(route);
    }
  }

  function applyActiveView(route) {
    dockButtons.forEach(btn => {
      const btnRoute = btn.getAttribute("data-route");
      if (btnRoute === route) {
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
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
    const currentHash = window.location.hash.slice(1);
    if (currentHash) {
      switchView(currentHash, true);
    }
  });

  const initialHash = window.location.hash.slice(1) || "overview";
  switchView(initialHash, false);

  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "1") switchView("overview", true);
    if (e.key === "2") switchView("my-events", true);
    if (e.key === "3") switchView("events", true);
  });
}

/* ==========================================================================
   7. Explore Events Search & Category Filter
   ========================================================================== */
function initEventsFilterAndSearch() {
  const searchInput = document.getElementById("events-search-input");
  const categoryChips = document.querySelectorAll(".category-chip");
  const exploreCards = document.querySelectorAll(".explore-event-card");
  const emptyStateEl = document.getElementById("events-empty-state");

  if (exploreCards.length) {
    let currentCategory = "all";
    let currentQuery = "";

    function filterExploreCards() {
      let visibleCount = 0;

      exploreCards.forEach(card => {
        const title = (card.querySelector(".event-card-title")?.textContent || "").toLowerCase();
        const desc = (card.querySelector(".event-card-desc")?.textContent || "").toLowerCase();
        const category = card.getAttribute("data-category") || "";

        const matchesQuery = !currentQuery || title.includes(currentQuery) || desc.includes(currentQuery);
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
      searchInput.addEventListener("input", (e) => {
        currentQuery = e.target.value.trim().toLowerCase();
        filterExploreCards();
      });
    }

    categoryChips.forEach(chip => {
      chip.addEventListener("click", () => {
        categoryChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentCategory = chip.getAttribute("data-category");
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
            regBtn.className = "btn btn-black btn-sm btn-action-register";
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
}

/* ==========================================================================
   8. Profile Popover Controller
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
   9. Auth Forms: Real Inline Validation & 3-Step Wizard
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

  const loginForm = document.getElementById("login-form");
  const demoLoginBtn = document.getElementById("btn-demo-login");

  if (loginForm) {
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        emailInput.classList.add("is-invalid");
        isValid = false;
      } else {
        emailInput.classList.remove("is-invalid");
        emailInput.classList.add("is-valid");
      }

      if (passwordInput.value.length < 6) {
        passwordInput.classList.add("is-invalid");
        isValid = false;
      } else {
        passwordInput.classList.remove("is-invalid");
        passwordInput.classList.add("is-valid");
      }

      if (isValid) {
        window.location.href = "dashboard.html#overview";
      }
    });

    if (demoLoginBtn) {
      demoLoginBtn.addEventListener("click", () => {
        emailInput.value = "avi.stark@campuscode.dev";
        passwordInput.value = "StarkShip2026!";
        emailInput.classList.remove("is-invalid");
        emailInput.classList.add("is-valid");
        passwordInput.classList.remove("is-invalid");
        passwordInput.classList.add("is-valid");

        setTimeout(() => {
          window.location.href = "dashboard.html#overview";
        }, 300);
      });
    }
  }

  const regForm = document.getElementById("register-wizard-form");
  if (regForm) {
    let currentStep = 1;

    const step1El = document.getElementById("wizard-step-1");
    const step2El = document.getElementById("wizard-step-2");
    const step3El = document.getElementById("wizard-step-3");
    const successEl = document.getElementById("wizard-success-state");

    const track1 = document.getElementById("step-track-1");
    const track2 = document.getElementById("step-track-2");
    const track3 = document.getElementById("step-track-3");

    const nextBtn1 = document.getElementById("btn-next-step-1");
    const nextBtn2 = document.getElementById("btn-next-step-2");
    const backBtn2 = document.getElementById("btn-back-step-2");
    const backBtn3 = document.getElementById("btn-back-step-3");

    function updateProgressIndicators() {
      track1.className = currentStep >= 1 ? (currentStep > 1 ? "wizard-bar-segment completed" : "wizard-bar-segment active") : "wizard-bar-segment";
      track2.className = currentStep >= 2 ? (currentStep > 2 ? "wizard-bar-segment completed" : "wizard-bar-segment active") : "wizard-bar-segment";
      track3.className = currentStep >= 3 ? (currentStep > 3 ? "wizard-bar-segment completed" : "wizard-bar-segment active") : "wizard-bar-segment";
    }

    if (nextBtn1) {
      nextBtn1.addEventListener("click", () => {
        const nameInput = document.getElementById("reg-name");
        const collegeInput = document.getElementById("reg-college");

        let valid = true;
        if (!nameInput.value.trim()) {
          nameInput.classList.add("is-invalid");
          valid = false;
        } else {
          nameInput.classList.remove("is-invalid");
        }

        if (!collegeInput.value.trim()) {
          collegeInput.classList.add("is-invalid");
          valid = false;
        } else {
          collegeInput.classList.remove("is-invalid");
        }

        if (valid) {
          step1El.style.display = "none";
          step2El.style.display = "block";
          currentStep = 2;
          updateProgressIndicators();
        }
      });
    }

    if (backBtn2) {
      backBtn2.addEventListener("click", () => {
        step2El.style.display = "none";
        step1El.style.display = "block";
        currentStep = 1;
        updateProgressIndicators();
      });
    }

    if (nextBtn2) {
      nextBtn2.addEventListener("click", () => {
        const emailInput = document.getElementById("reg-email");
        const passwordInput = document.getElementById("reg-password");

        let valid = true;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
          emailInput.classList.add("is-invalid");
          valid = false;
        } else {
          emailInput.classList.remove("is-invalid");
        }

        if (passwordInput.value.length < 6) {
          passwordInput.classList.add("is-invalid");
          valid = false;
        } else {
          passwordInput.classList.remove("is-invalid");
        }

        if (valid) {
          step2El.style.display = "none";
          step3El.style.display = "block";
          currentStep = 3;
          updateProgressIndicators();
        }
      });
    }

    if (backBtn3) {
      backBtn3.addEventListener("click", () => {
        step3El.style.display = "none";
        step2El.style.display = "block";
        currentStep = 2;
        updateProgressIndicators();
      });
    }

    regForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const rulesCheck = document.getElementById("reg-rules-check");
      const ageCheck = document.getElementById("reg-age-check");

      if (!rulesCheck.checked || !ageCheck.checked) {
        alert("Please confirm that you agree to the Arena Rules and are 18+ to proceed.");
        return;
      }

      step3El.style.display = "none";
      if (successEl) {
        successEl.style.display = "block";
        currentStep = 4;
        updateProgressIndicators();

        setTimeout(() => {
          window.location.href = "dashboard.html#overview";
        }, 1500);
      }
    });
  }
}
