/**
 * CampusCode ReBuild '26 — Student Application Engine
 *
 * Core Engineering Workspace Client
 * Features:
 *   - 3D Rotating Cylindrical Carousel (My Events) with Depth Fade & Flip
 *   - 3D Flip-Clock Countdown (Round 2 Cutoff: Closes 11:00 AM IST, Sun 8 Nov)
 *   - Horizontal 3-Round Timeline Track (R1 Recreate, R2 Rebuild, R3 Interview)
 *   - Hash Navigation & Floating Pill Bottom Dock
 *   - Real Inline Auth Validation & 3-Step Wizard
 */

// Top Configuration Constants
const STUDENT_NAME = "Avi";
const TEAM_NAME = "Team Stark";
const DEADLINE_IST = "2026-11-08T11:00:00+05:30";

window.STUDENT_NAME = STUDENT_NAME;
window.TEAM_NAME = TEAM_NAME;
window.DEADLINE_IST = DEADLINE_IST;

/* ==========================================================================
   CampusCode Toast Notification System
   Replaces native browser Chrome alert/confirm/prompt dialogs with architectural UI toasts
   ========================================================================== */
function showCampusToast(message, type = "info") {
  let container = document.getElementById("campus-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "campus-toast-container";
    container.setAttribute("role", "region");
    container.setAttribute("aria-label", "Notifications");
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `campus-toast campus-toast-${type}`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "polite");

  let typeBadge = "NOTIFICATION";
  let badgeClass = "slash-badge-lime";
  if (type === "success") {
    typeBadge = "PASSED // VERIFIED";
    badgeClass = "slash-badge-lime";
  } else if (type === "warning") {
    typeBadge = "INPUT REQUIRED";
    badgeClass = "slash-badge-purple";
  } else if (type === "error") {
    typeBadge = "ERROR DETECTED";
    badgeClass = "slash-badge-black";
  }

  toast.innerHTML = `
    <div class="campus-toast-body">
      <div class="campus-toast-badge-row">
        <span class="slash-badge ${badgeClass}" style="font-size: 0.65rem; padding: 2px 7px;">${typeBadge}</span>
        <span class="mono" style="font-size: 0.68rem; color: var(--text-on-black-muted);">CampusCode Node</span>
      </div>
      <div class="campus-toast-msg">${message}</div>
    </div>
    <button type="button" class="campus-toast-close" aria-label="Close notification">✕</button>
  `;

  const closeBtn = toast.querySelector(".campus-toast-close");
  let dismissTimeout = null;

  function dismiss() {
    if (toast.classList.contains("is-exiting")) return;
    toast.classList.add("is-exiting");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }

  if (closeBtn) closeBtn.addEventListener("click", dismiss);

  dismissTimeout = setTimeout(dismiss, 3800);

  toast.addEventListener("mouseenter", () => {
    if (dismissTimeout) clearTimeout(dismissTimeout);
  });
  toast.addEventListener("mouseleave", () => {
    dismissTimeout = setTimeout(dismiss, 2000);
  });

  container.appendChild(toast);
}

// Override native window.alert, confirm, prompt so Chrome notification popups never appear
window.alert = function (message) {
  const msgLower = String(message || "").toLowerCase();
  let type = "info";
  if (msgLower.includes("renew") || msgLower.includes("success") || msgLower.includes("verified") || msgLower.includes("approved") || msgLower.includes("download")) {
    type = "success";
  } else if (msgLower.includes("error") || msgLower.includes("failed") || msgLower.includes("invalid")) {
    type = "error";
  } else if (msgLower.includes("warn") || msgLower.includes("require")) {
    type = "warning";
  }
  showCampusToast(message, type);
};

window.confirm = function (message) {
  showCampusToast(message, "info");
  return true;
};

window.prompt = function (message, defaultVal = "") {
  showCampusToast(message, "info");
  return defaultVal;
};

window.showCampusToast = showCampusToast;

// Drain any preemptively intercepted alerts
if (Array.isArray(window.__campusToastQueue) && window.__campusToastQueue.length) {
  const pendingQueue = window.__campusToastQueue.slice();
  window.__campusToastQueue = [];
  pendingQueue.forEach(item => {
    if (item && item.msg) {
      showCampusToast(item.msg, item.type || "info");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initStudentContext();
  initFlipClockCountdown();
  initHeroSlabs3D(prefersReducedMotion);
  initOverviewHero3D(prefersReducedMotion);
  init3DCarousel(prefersReducedMotion);
  initDashboardRouting();
  initEventsFilterAndSearch();
  initProfilePopover();
  initActivityCenter();
  initWorkspaceAndHackMate();
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
   2. 3D Flip-Clock Countdown Engine (Closes 11:00 AM IST, Sun 8 Nov)
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
   2b. Landing Hero 3D Slabs Stage (Staggered Entrance, Scroll Drift, rAF Tilt)
   ========================================================================== */
function initHeroSlabs3D(reducedMotion) {
  const wrapper = document.getElementById("hero-stage-wrapper");
  const viewport = document.getElementById("hero-stage-viewport");
  const slabBlack = document.getElementById("slab-black");
  const slabPurple = document.getElementById("slab-purple");
  const slabLime = document.getElementById("slab-lime");

  if (!viewport || !slabBlack || !slabPurple || !slabLime) return;

  if (reducedMotion) {
    viewport.style.transform = "none";
    slabBlack.style.transform = "none";
    slabPurple.style.transform = "none";
    slabLime.style.transform = "none";
    slabBlack.style.opacity = "1";
    slabPurple.style.opacity = "1";
    slabLime.style.opacity = "1";
    return;
  }

  // Base depths
  const baseBlackZ = 0;
  const basePurpleZ = 40;
  const baseLimeZ = 80;

  // Staggered entrance on initial load
  slabBlack.style.opacity = "0";
  slabBlack.style.transform = "translate3d(0, 0, -60px)";
  slabPurple.style.opacity = "0";
  slabPurple.style.transform = "translate3d(0, 0, -20px)";
  slabLime.style.opacity = "0";
  slabLime.style.transform = "translate3d(0, 0, 140px)";

  requestAnimationFrame(() => {
    setTimeout(() => {
      slabBlack.style.transition = "transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 450ms ease";
      slabBlack.style.opacity = "1";
      slabBlack.style.transform = `translate3d(0, 0, ${baseBlackZ}px)`;
    }, 50);

    setTimeout(() => {
      slabPurple.style.transition = "transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 450ms ease";
      slabPurple.style.opacity = "1";
      slabPurple.style.transform = `translate3d(0, 0, ${basePurpleZ}px)`;
    }, 160);

    setTimeout(() => {
      slabLime.style.transition = "transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 450ms ease";
      slabLime.style.opacity = "1";
      slabLime.style.transform = `translate3d(0, 0, ${baseLimeZ}px)`;
    }, 280);
  });

  // Parallax Z-depth drift on scroll
  let currentScroll = 0;
  let tickingScroll = false;

  window.addEventListener("scroll", () => {
    if (!tickingScroll) {
      window.requestAnimationFrame(() => {
        currentScroll = window.scrollY || window.pageYOffset || 0;
        if (currentScroll < 800) {
          const drift = currentScroll * 0.25;
          slabBlack.style.transform = `translate3d(0, 0, ${baseBlackZ - drift * 0.4}px)`;
          slabPurple.style.transform = `translate3d(0, 0, ${basePurpleZ + drift * 0.6}px)`;
          slabLime.style.transform = `translate3d(0, 0, ${baseLimeZ + drift * 1.3}px)`;
        }
        tickingScroll = false;
      });
      tickingScroll = true;
    }
  }, { passive: true });

  // Pointer tilt (rAF-smoothed)
  const baseRotX = 12;
  const baseRotY = -18;
  const baseRotZ = 3;

  let targetTiltX = 0;
  let targetTiltY = 0;
  let curTiltX = 0;
  let curTiltY = 0;
  let isTilting = false;

  function renderTilt() {
    curTiltX += (targetTiltX - curTiltX) * 0.08;
    curTiltY += (targetTiltY - curTiltY) * 0.08;

    viewport.style.transform = `rotateX(${baseRotX + curTiltX}deg) rotateY(${baseRotY + curTiltY}deg) rotateZ(${baseRotZ}deg)`;

    if (Math.abs(targetTiltX - curTiltX) > 0.05 || Math.abs(targetTiltY - curTiltY) > 0.05) {
      requestAnimationFrame(renderTilt);
    } else {
      isTilting = false;
    }
  }

  function handlePointerMove(e) {
    const rect = (wrapper || viewport).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = (e.clientX - centerX) / (window.innerWidth / 2);
    const normY = (e.clientY - centerY) / (window.innerHeight / 2);

    targetTiltY = Math.max(-12, Math.min(12, normX * 14));
    targetTiltX = Math.max(-10, Math.min(10, -normY * 12));

    if (!isTilting) {
      isTilting = true;
      requestAnimationFrame(renderTilt);
    }
  }

  function handlePointerLeave() {
    targetTiltX = 0;
    targetTiltY = 0;
    if (!isTilting) {
      isTilting = true;
      requestAnimationFrame(renderTilt);
    }
  }

  const heroSec = document.getElementById("hero");
  if (heroSec) {
    heroSec.addEventListener("pointermove", handlePointerMove, { passive: true });
    heroSec.addEventListener("pointerleave", handlePointerLeave, { passive: true });
  }
}

/* ==========================================================================
   2c. Overview Hero 3D Slab Pair (Subtle Pointer Parallax)
   ========================================================================== */
function initOverviewHero3D(reducedMotion) {
  const slabPair = document.getElementById("overview-slab-pair");
  const heroLight = document.querySelector(".overview-hero-light");

  if (!slabPair || !heroLight) return;

  if (reducedMotion) {
    slabPair.style.transform = "none";
    return;
  }

  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;
  let isTilting = false;

  const baseRotX = 14;
  const baseRotY = -18;
  const baseRotZ = 3;

  function renderOverviewTilt() {
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;

    slabPair.style.transform = `rotateX(${baseRotX + curX}deg) rotateY(${baseRotY + curY}deg) rotateZ(${baseRotZ}deg)`;

    if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
      requestAnimationFrame(renderOverviewTilt);
    } else {
      isTilting = false;
    }
  }

  heroLight.addEventListener("pointermove", (e) => {
    const rect = heroLight.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    targetY = relX * 10;
    targetX = -relY * 8;

    if (!isTilting) {
      isTilting = true;
      requestAnimationFrame(renderOverviewTilt);
    }
  }, { passive: true });

  heroLight.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
    if (!isTilting) {
      isTilting = true;
      requestAnimationFrame(renderOverviewTilt);
    }
  }, { passive: true });
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

    window.__campusCarouselIndex = currentIndex;
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
   Coordinated 2-stage section transition with sliding lime glider
   ========================================================================== */
function initDashboardRouting() {
  const dockButtons = document.querySelectorAll(".floating-bottom-dock .dock-item-btn[data-route]");
  const viewPanels = document.querySelectorAll(".dashboard-view-panel");
  const breadcrumbEl = document.getElementById("active-crumb-label");
  const glider = document.getElementById("dock-glider");

  if (!viewPanels.length) return;

  function updateDockGlider(activeBtn, immediate = false) {
    if (!glider || !activeBtn) return;
    const left = activeBtn.offsetLeft;
    const width = activeBtn.offsetWidth;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (immediate || prefersReducedMotion) {
      glider.style.transition = "none";
      glider.style.transform = `translate3d(${left}px, 0, 0)`;
      glider.style.width = `${width}px`;
      glider.style.opacity = "1";
      void glider.offsetHeight;
      glider.style.transition = "";
    } else {
      glider.style.transform = `translate3d(${left}px, 0, 0)`;
      glider.style.width = `${width}px`;
      glider.style.opacity = "1";
    }
  }

  let activeTransitionTimeout = null;
  let currentlyTransitioningPanel = null;

  function switchView(targetRoute, isInitial = false) {
    const route = targetRoute.replace("#", "") || "overview";
    const targetPanel = document.getElementById(`view-${route}`);
    if (!targetPanel) return;

    let activeBtn = null;
    dockButtons.forEach(btn => {
      const btnRoute = btn.getAttribute("data-route");
      if (btnRoute === route) {
        btn.classList.add("active");
        btn.setAttribute("aria-current", "page");
        activeBtn = btn;
      } else {
        btn.classList.remove("active");
        btn.removeAttribute("aria-current");
      }
    });

    if (activeBtn) {
      updateDockGlider(activeBtn, isInitial);
      if (activeBtn.scrollIntoView) {
        activeBtn.scrollIntoView({ behavior: isInitial ? "auto" : "smooth", inline: "nearest", block: "nearest" });
      }
    }

    if (breadcrumbEl) {
      const labels = {
        "overview": "Overview Track",
        "my-events": "My Events Portfolio",
        "events": "Challenge Arena",
        "workspace": "Project Workspace",
        "hackmate": "HackMate Squad Board",
        "achievements": "Verified Credentials"
      };
      breadcrumbEl.textContent = labels[route] || "Student Workspace";
    }

    const currentPanel = document.querySelector(".dashboard-view-panel.active");
    if (currentPanel === targetPanel && !isInitial) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Clear any running transition if user clicks rapidly
    if (activeTransitionTimeout) {
      clearTimeout(activeTransitionTimeout);
      activeTransitionTimeout = null;
    }
    if (currentlyTransitioningPanel) {
      currentlyTransitioningPanel.classList.remove("is-exiting");
      currentlyTransitioningPanel.classList.remove("active");
      currentlyTransitioningPanel.setAttribute("hidden", "true");
      currentlyTransitioningPanel = null;
    }

    if (isInitial || prefersReducedMotion || !currentPanel) {
      viewPanels.forEach(panel => {
        if (panel === targetPanel) {
          panel.classList.remove("is-exiting", "is-entering");
          panel.classList.add("active");
          panel.removeAttribute("hidden");
        } else {
          panel.classList.remove("active", "is-exiting", "is-entering");
          panel.setAttribute("hidden", "true");
        }
      });
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      return;
    }

    // Phase 1: Gently fade out and translate current panel upward -8px (140ms)
    currentlyTransitioningPanel = currentPanel;
    currentPanel.classList.add("is-exiting");

    activeTransitionTimeout = setTimeout(() => {
      activeTransitionTimeout = null;
      currentlyTransitioningPanel = null;

      // Phase 2: Hide previous panel and prime new panel
      currentPanel.classList.remove("is-exiting", "active");
      currentPanel.setAttribute("hidden", "true");

      targetPanel.classList.add("is-entering");
      targetPanel.removeAttribute("hidden");

      window.scrollTo({ top: 0, behavior: "auto" });

      // Force layout reflow before triggering smooth entry
      void targetPanel.offsetWidth;

      // Enter smoothly and settle into position in 280ms
      targetPanel.classList.remove("is-entering");
      targetPanel.classList.add("active");
    }, 140);
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

  window.addEventListener("resize", () => {
    const activeBtn = document.querySelector(".floating-bottom-dock .dock-item-btn.active");
    if (activeBtn) updateDockGlider(activeBtn, true);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      const activeBtn = document.querySelector(".floating-bottom-dock .dock-item-btn.active");
      if (activeBtn) updateDockGlider(activeBtn, true);
    });
  }

  const initialHash = window.location.hash.slice(1) || "overview";
  switchView(initialHash, true);

  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
    if (e.key === "1") { window.location.hash = "#overview"; }
    else if (e.key === "2") { window.location.hash = "#my-events"; }
    else if (e.key === "3") { window.location.hash = "#events"; }
    else if (e.key === "4") { window.location.hash = "#workspace"; }
    else if (e.key === "5") { window.location.hash = "#hackmate"; }
    else if (e.key === "6") { window.location.hash = "#achievements"; }
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
   6b. Activity Center & Telemetry Feed Modal
   ========================================================================== */
function initActivityCenter() {
  const activityBtn = document.getElementById("topbar-activity-btn");
  const activityModal = document.getElementById("activity-modal");
  const activityBackdrop = document.getElementById("activity-backdrop");
  const closeBtn = document.getElementById("activity-modal-close");
  const btnClose = document.getElementById("btn-close-activity");
  const markReadBtn = document.getElementById("btn-mark-all-read");
  const unreadCount = document.getElementById("activity-unread-count");

  if (!activityBtn || !activityModal || !activityBackdrop) return;

  function openActivity() {
    activityBackdrop.classList.add("is-open");
    activityModal.classList.add("is-open");
    activityModal.setAttribute("aria-hidden", "false");
    activityModal.focus();
  }

  function closeActivity() {
    activityBackdrop.classList.remove("is-open");
    activityModal.classList.remove("is-open");
    activityModal.setAttribute("aria-hidden", "true");
    activityBtn.focus();
  }

  activityBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (activityModal.classList.contains("is-open")) closeActivity();
    else openActivity();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeActivity);
  if (btnClose) btnClose.addEventListener("click", closeActivity);
  activityBackdrop.addEventListener("click", closeActivity);

  if (markReadBtn && unreadCount) {
    markReadBtn.addEventListener("click", () => {
      unreadCount.textContent = "0";
      unreadCount.style.display = "none";
      showCampusToast("All activity notifications marked as read.", "info");
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activityModal.classList.contains("is-open")) {
      closeActivity();
    }
  });
}

/* ==========================================================================
   6c. Workspace Checkpoints & HackMate Teammate Interactions
   ========================================================================== */
function initWorkspaceAndHackMate() {
  const pushBtn = document.getElementById("btn-push-checkpoint");
  if (pushBtn) {
    pushBtn.addEventListener("click", () => {
      pushBtn.textContent = "Pushing Checkpoint...";
      setTimeout(() => {
        pushBtn.textContent = "Push New Sprint Checkpoint ↑";
        showCampusToast("Sprint milestone checkpoint submitted to review panel.", "success");
      }, 400);
    });
  }

  const inviteBtns = document.querySelectorAll(".btn-invite-candidate");
  inviteBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const candidate = btn.getAttribute("data-candidate") || "candidate";
      if (!btn.classList.contains("is-invited")) {
        btn.classList.add("is-invited");
        btn.className = "btn btn-secondary btn-sm btn-invite-candidate is-invited";
        btn.innerHTML = `<span>✓ Invitation Dispatched</span>`;
        showCampusToast(`Invitation dispatched to ${candidate} for Team Stark.`, "success");
      } else {
        showCampusToast(`Invitation already pending with ${candidate}.`, "info");
      }
    });
  });

  const downloadBadgeBtn = document.querySelector(".btn-download-badge");
  if (downloadBadgeBtn) {
    downloadBadgeBtn.addEventListener("click", () => {
      showCampusToast("Digital Credential #CC-26-8842 downloaded to your device.", "success");
    });
  }

  const downloadCertBtns = document.querySelectorAll(".btn-download-cert");
  downloadCertBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const cert = btn.getAttribute("data-cert") || "Certificate";
      showCampusToast(`Downloading ${cert} PDF...`, "success");
    });
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

  const forgotPassBtn = document.getElementById("btn-forgot-password");
  if (forgotPassBtn) {
    forgotPassBtn.addEventListener("click", () => {
      const emailInput = document.getElementById("login-email");
      const targetEmail = (emailInput && emailInput.value.includes("@")) ? emailInput.value : "your registered student email";
      showCampusToast(`Password reset link dispatched to ${targetEmail}.`, "info");
    });
  }

  const passStrengthInput = document.getElementById("reg-password");
  const passStrengthFill = document.getElementById("pass-strength-fill");
  const passStrengthText = document.getElementById("pass-strength-text");

  if (passStrengthInput && passStrengthFill && passStrengthText) {
    passStrengthInput.addEventListener("input", () => {
      const val = passStrengthInput.value;
      if (!val) {
        passStrengthFill.style.width = "0%";
        passStrengthFill.style.backgroundColor = "transparent";
        passStrengthText.textContent = "Too short";
        passStrengthText.style.color = "var(--text-muted)";
      } else if (val.length < 6) {
        passStrengthFill.style.width = "25%";
        passStrengthFill.style.backgroundColor = "#ff4d4f";
        passStrengthText.textContent = "Too short";
        passStrengthText.style.color = "#ff4d4f";
      } else if (val.length < 10) {
        passStrengthFill.style.width = "65%";
        passStrengthFill.style.backgroundColor = "var(--purple)";
        passStrengthText.textContent = "Fair";
        passStrengthText.style.color = "var(--purple)";
      } else {
        passStrengthFill.style.width = "100%";
        passStrengthFill.style.backgroundColor = "var(--lime-dark)";
        passStrengthText.textContent = "Strong";
        passStrengthText.style.color = "var(--lime-dark)";
      }
    });
  }

  const demoLoginBtn = document.getElementById("btn-demo-login");
  if (demoLoginBtn) {
    demoLoginBtn.addEventListener("click", () => {
      const emailInput = document.getElementById("login-email");
      const passInput = document.getElementById("login-password");
      if (emailInput) emailInput.value = "avi.stark@campuscode.dev";
      if (passInput) passInput.value = "••••••••••••";
      demoLoginBtn.textContent = "Authenticating...";
      showCampusToast("Identity verified · Initializing student workspace...", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html#overview";
      }, 500);
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
        showCampusToast("Authentication verified. Loading workspace...", "success");
        setTimeout(() => {
          window.location.href = "dashboard.html#overview";
        }, 400);
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
        showCampusToast("Please accept the Arena Rules and Code of Conduct.", "warning");
        return;
      }
      if (ageCheck && !ageCheck.checked) {
        showCampusToast("You must confirm you are an active student aged 18+.", "warning");
        return;
      }

      if (step3) step3.style.display = "none";
      if (track3) track3.className = "wizard-bar-segment completed";
      if (successState) successState.style.display = "block";

      showCampusToast("Registration approved · Creating student pass...", "success");

      setTimeout(() => {
        window.location.href = "dashboard.html#overview";
      }, 1000);
    });
  }
}
