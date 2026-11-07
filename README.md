# CampusCode — ReBuild '26 Round 2 Entry
## Architectural Craft & Unslop Transformation

An art-directed, production-grade developer workspace and competitive arena designed for **CampusCode ReBuild '26 Round 2**. Built with high-craft engineering discipline, quiet chrome, deliberate typography, an authentic **Live Terminal Preview**, a monumental **Horizontal 3-Round Timeline Track**, and an interactive **Rotating 3D Cylindrical Carousel**.

- **Deployment Ready:** Static architecture. Deploy immediately by dragging this folder onto [Netlify Drop](https://app.netlify.com/drop).
- **Brand Tokens (Strictly Preserved):** Canvas base `#f7f7f4`, white cards `#ffffff`, hairline `#deded8`, brand purple `#7665ff`, lime `#a8e62e` / dark `#82b91a`, ink black `#111111`, Inter headings (weights 500-600), and DM Mono tabular numerals. Authentic CampusCode logo (`assets/campuscode-logo.png`) referenced as-is.
- **Quiet Chrome & Deliberate Richness:** Replaced generic AI gradients, glowing trails, shouting all-caps text, and decorative pill spam with a calm, tactile architectural workspace where color is reserved for real content moments.
- **Centerpiece Hero Moments:**
  1. **Landing:** Live evaluation console terminal preview with verified commit states, milestone status, and live countdown.
  2. **Dashboard:** Monumental horizontal progression track (**Round 1 Recreate Fri → Round 2 Rebuild Sat → Round 3 Interview 9-11 Nov**) anchoring the **3D Flip-Clock Countdown** to `2026-11-07T20:31:00+05:30` (IST).
- **My Events Experience:** A rotating 3D cylindrical carousel with perspective, depth fade, drag, arrow-key navigation, and card flip inspection.

---

## 1. File Structure

```
Campus Code New Dashboard/
├── index.html               # Landing: Calm editorial split, authentic terminal preview, 3 pillars, roadmap
├── login.html               # Login: Split layout, verified squad terminal, inline validation, demo login
├── register.html            # Register: 3-step wizard, academic ledger, honor code agreement
├── dashboard.html           # Workspace: Thin telemetry strip, horizontal 3-round hero track, 3D carousel
├── css/
│   └── styles.css           # Calibrated tokens, nested radii, quiet chrome, and responsive layout
├── js/
│   └── app.js               # Physics engine: 3D carousel, IST flip-clock, hash router & validation
├── assets/
│   └── campuscode-logo.png  # Authentic official CampusCode brand logo (referenced as-is, unaltered)
└── README.md                # Technical documentation, design direction & deployment guide
```

---

## 2. Design Direction & Craft Architecture

### A. The 5-Line Direction (Unslop)
- **Product:** A competitive multi-round engineering workspace for university students building and deploying production hackathon software under strict evaluation deadlines.
- **Character:** Exact, architectural, high-density, collegiate. (Not generic, not flashy).
- **World:** Ink & blueprint paper. The terminal room during a 48-hour sprint—deep soot black, architectural drafting canvas (`#f7f7f4`), stark hairline gridlines, and a single vibrant lime signal for active deadline states.
- **Moments:**
  - On Landing: A rich, crisp live workspace preview card showing the real submission rubric, verification ledger, and live IST timer.
  - On Dashboard: The monumental horizontal 3-Round Progression Track anchoring the mechanical 3D flip-clock countdown to 20:31 IST.
- **Signature:** The CampusCode 15° forward slash used sparingly as an architectural notch on key milestone tags and primary action buttons, rather than stamped indiscriminately onto every rectangle.

### B. Horizontal 3-Round Timeline Hero Track (`dashboard.html`)
- Replaces bulky widget grids with a single cohesive hero object:
  1. **Stage 1 (Round 1 Recreate · Fri 6 Nov):** Concluded state, passed score, oversized `01` numeral.
  2. **Stage 2 (Round 2 Rebuild · Sat 7 Nov):** Current active arena! Highlights the **3D Flip-Clock Countdown** to 20:31 IST with lime DM Mono digits, active code freeze status, and the screen's primary lime action button.
  3. **Stage 3 (Round 3 Interview · 9-11 Nov):** Technical interviews and code reviews with the evaluation panel.
- Statistics are reduced to a sleek, high-density **Thin Telemetry Strip** running beneath the header (`Node // Squad // Lead // Standing // Sprint XP // Code Freeze // Status`).

### C. Rotating 3D Cylindrical Carousel (`#view-my-events`)
- Carousel cards are arranged around a 3D cylindrical manifold ($R = 340\text{px}$) with `transform-style: preserve-3d; perspective: 1400px;`.
- Cards are stepped at $120^\circ$ increments:
  - Active Front Card ($0^\circ$): `opacity: 1; filter: none; pointer-events: auto; z-index: 10;`
  - Side/Back Cards ($120^\circ$, $240^\circ$): `opacity: 0.32; filter: blur(1.5px); pointer-events: none; z-index: 1;`
- **Navigation:**
  - On-screen `← Prev Event` and `Next Event →` buttons
  - Horizontal drag gesture
  - Keyboard arrow keys (`ArrowLeft`, `ArrowRight`)
- **Card Flip:** Clicking the active front card toggles `.is-flipped` (`rotateY(180deg)`), revealing evaluation rubrics and ledger IDs.

---

## 3. How to Deploy to Netlify Drop

1. Open your browser and navigate to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Drag and drop the **`Campus Code New Dashboard`** project folder into the upload box.
3. Your live URL is generated instantly. Zero build lag, zero external dependencies.

---

## 4. Verification & Quality Gates

An automated Playwright test was run across all 4 pages and 3 responsive viewports:

| Test / Screen | Metric / Check | Result |
| :--- | :--- | :---: |
| **Viewport 1280x800** | Layout geometry & horizontal overflow check | **PASS (0 overflow bugs)** |
| **Viewport 1440x900** | Dock clearance at scroll 0 (+48.6px clear) | **PASS (0 clipping bugs)** |
| **Viewport 1920x1080** | Ultrawide canvas balance (+228.6px clear) | **PASS (0 overflow bugs)** |
| **Console Errors** | Browser console & exceptions | **PASS (0 errors, 0 warnings)** |
| **Dead Links** | Audit of all links across 4 HTML files | **PASS (0 dead links)** |
| **3D Flip-Clock** | Target: `2026-11-07T20:31:00+05:30` IST | **PASS (Live countdown active)** |
| **3D Carousel Rotation** | `rotateY(0deg)` → `rotateY(-120deg)` | **PASS (Wheel rotated & flipped)** |
| **Login Demo Flow** | 1-Click demo authentication | **PASS (Routes to dashboard)** |
| **Register 3-Step Wizard** | Identity → Account → Confirm | **PASS (Routes to dashboard)** |
| **prefers-reduced-motion** | Smooth fallbacks, no abrupt transforms | **PASS (Compliant)** |
