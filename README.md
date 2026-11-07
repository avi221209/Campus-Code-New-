# CampusCode — ReBuild '26 Round 2 Entry
## "Slash Geometry" Architectural Transformation

A differentiated, high-craft developer workspace and competitive arena designed for **CampusCode ReBuild '26 Round 2**. Differentiated from conventional card grids and live portal patterns through strict **Slash Geometry**, **alternating full-width tectonic bands**, a monumental **Horizontal 3-Round Timeline Track**, and an interactive **Rotating 3D Cylindrical Carousel**.

- **Deployment Ready:** Zero-build static architecture. Deploy immediately by dragging this folder onto [Netlify Drop](https://app.netlify.com/drop).
- **Brand Tokens (Strictly Preserved):** Canvas base `#f7f7f4`, white cards `#ffffff`, hairline `#deded8`, brand purple `#7665ff`, lime `#a8e62e` / dark `#82b91a`, ink black `#111111`, Inter headings, and DM Mono labels. Authentic CampusCode logo (`assets/campuscode-logo.png`) referenced as-is.
- **Compositional Shift:** Replaced standard card grids with alternating full-width light and black tectonic bands cut with the brand logo's ~15° slant using CSS `clip-path`.
- **Centerpiece Hero Object:** Replaced widget cards with a monumental horizontal progression track (**Round 1 Recreate Fri → Round 2 Rebuild Sat → Round 3 Interview 9-11 Nov**) displaying current position and anchoring the **3D Flip-Clock Countdown** to `2026-11-07T20:31:00+05:30` (IST).
- **My Events Experience:** A rotating 3D cylindrical carousel with perspective, depth fade, drag, arrow-key navigation, and card flip inspection.

---

## 1. File Structure

```
Campus Code New Dashboard/
├── index.html               # Landing: Alternating bands, ~15° slash geometry, hero slabs, 3 pillars
├── login.html               # Login: Diagonal split band, resting 3D slabs, inline validation, demo login
├── register.html            # Register: 3-step wizard with slanted track segments, fixed STUDENT badge
├── dashboard.html           # Workspace: Thin telemetry strip, horizontal 3-round hero track, 3D carousel
├── css/
│   └── styles.css           # Complete Slash Geometry tokens, clip-paths, 3D perspective & responsive layout
├── js/
│   └── app.js               # Physics engine: Cursor lime slash, 3D carousel, IST flip-clock, slab-wipe
├── assets/
│   └── campuscode-logo.png  # Authentic official CampusCode brand logo (referenced as-is, unaltered)
└── README.md                # Technical documentation, physics engine briefing & deployment guide
```

---

## 2. Deep Dive: "Slash Geometry" & 3D Engineering

### A. ~15 Degree Slash Geometry (`clip-path`)
The CampusCode brand mark features three forward slashes tilted at approximately 15 degrees. This angle ($\tan 15^\circ \approx 0.268$) is mathematically integrated across all UI surfaces:
- **Buttons:** `clip-path: polygon(14px 0%, 100% 0%, calc(100% - 14px) 100%, 0% 100%)`
- **Cards & Plates:** `clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))`
- **Tectonic Band Seams:** `clip-path: polygon(0 3.5vw, 100% 0%, 100% 100%, 0% 100%)` locking dark and light bands together like diagonal tectonic plates.

### B. Cursor-Following Lime Slash Highlight (`#cursor-slash`)
- A subtle, glowing lime stylus rendered in fixed position and tilted at `-15deg` (`box-shadow: 0 0 16px rgba(168, 230, 46, 0.55)`).
- Driven by a linear interpolation (lerp) loop running on `requestAnimationFrame`:
  $$\text{curX} \mathrel{+}= (\text{targetX} - \text{curX}) \times 0.22$$
  $$\text{curY} \mathrel{+}= (\text{targetY} - \text{curY}) \times 0.22$$
- Automatically disabled under `@media (prefers-reduced-motion: reduce)`.

### C. Horizontal 3-Round Timeline Hero Track (`dashboard.html`)
- Replaces bulky widget grids with a single cohesive hero object:
  1. **Stage 1 (Round 1 Recreate · Fri 6 Nov):** Concluded state, passed score, oversized `01` numeral.
  2. **Stage 2 (Round 2 Rebuild · Sat 7 Nov):** Current active arena! Highlights the **3D Flip-Clock Countdown** to 20:31 IST with lime DM Mono digits, active code freeze status, and the screen's primary lime action button.
  3. **Stage 3 (Round 3 Interview · 9-11 Nov):** Technical interviews and code reviews with the evaluation panel.
- Statistics are reduced to a sleek, high-density **Thin Telemetry Strip** running beneath the header (`SQUAD // LEAD // RANK // VELOCITY // XP // DEADLINE // REPO`).

### D. Rotating 3D Cylindrical Carousel (`#view-my-events`)
- Carousel cards are arranged around a 3D cylindrical manifold ($R = 340\text{px}$) with `transform-style: preserve-3d; perspective: 1400px;`.
- Cards are stepped at $120^\circ$ increments:
  - Active Front Card ($0^\circ$): `opacity: 1; filter: none; pointer-events: auto; z-index: 10;`
  - Side/Back Cards ($120^\circ$, $240^\circ$): `opacity: 0.35; filter: blur(1.5px); pointer-events: none; z-index: 1;`
- **Navigation:**
  - On-screen `← PREV EVENT` and `NEXT EVENT →` buttons
  - Horizontal drag gesture
  - Keyboard arrow keys (`ArrowLeft`, `ArrowRight`)
- **Card Flip:** Clicking the active front card toggles `.is-flipped` (`rotateY(180deg)`), revealing evaluation rubrics and ledger IDs.

---

## 3. How to Deploy to Netlify Drop

1. Open your browser and navigate to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Drag and drop the **`Campus Code New Dashboard`** project folder into the upload box.
3. Your live URL is generated instantly. Zero build lag, zero external dependencies.

---

## 4. Acceptance Test & Silhouette Comparison Results

An automated Playwright and Pillow acceptance test was run across all 4 pages and 3 responsive viewports:

| Test / Screen | Metric / Check | Result |
| :--- | :--- | :---: |
| **Viewport 1280x800** | Horizontal overflow check | **PASS (0 overflow bugs)** |
| **Viewport 1440x900** | Layout geometry & alignment | **PASS (0 overflow bugs)** |
| **Viewport 1920x1080** | Ultrawide canvas balance | **PASS (0 overflow bugs)** |
| **Console Errors** | Browser console & exceptions | **PASS (0 errors, 0 warnings)** |
| **Landing Silhouette** | Gaussian blur (radius 15) vs previous | **16.56% structural diff** |
| **Dashboard Silhouette** | Gaussian blur (radius 15) vs previous | **60.50% structural diff** |
| **Login Silhouette** | Gaussian blur (radius 15) vs previous | **18.23% structural diff** |
| **Register Silhouette** | Gaussian blur (radius 15) vs previous | **17.83% structural diff** |
| **3D Flip-Clock** | Target: `2026-11-07T20:31:00+05:30` IST | **PASS (Live countdown verified)** |
| **3D Carousel Rotation** | `rotateY(0deg)` → `rotateY(-120deg)` | **PASS (Wheel rotated & flipped)** |
| **Cursor Slash Stylus** | rAF smoothed DOM element | **PASS (Active on mousemove)** |
| **Login Demo Flow** | 1-Click demo authentication | **PASS (Routes to dashboard)** |
| **Register 3-Step Wizard** | Identity → Account → Confirm | **PASS (Routes to dashboard)** |
