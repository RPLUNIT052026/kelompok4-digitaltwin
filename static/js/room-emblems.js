/* Digital Twin Room v7.3 - Philosophical Logo, Status-Harmonized Static Gradient Room Artworks, Architectural 2D Twin & Chart Engine */

function renderBrandLogo(variant = "dark") {
  const cls = variant === "light" ? "brand-logo brand-logo--light" : "brand-logo";
  return `
    <div class="${cls}">
      <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Logo Digital Twin Room">
        <rect x="2" y="2" width="60" height="60" rx="16" fill="#0F3D34" stroke="rgba(167, 243, 208, 0.42)" stroke-width="1.5"/>
        <polygon points="32,12 15,22 15,42 32,52" fill="rgba(52, 211, 153, 0.18)"/>
        <path d="M32 12L15 22V42L32 52" stroke="#A7F3D0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M32 12V52" stroke="rgba(167, 243, 208, 0.35)" stroke-width="1.2"/>
        <path d="M32 12L49 22V42L32 52" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3.2 2.8"/>
        <path d="M15 22L32 32L49 22" stroke="rgba(52, 211, 153, 0.3)" stroke-width="1.2" stroke-dasharray="2 2"/>
        <path d="M24 29.1A8.5 8.5 0 0 1 40 29.1" stroke="#FBBF24" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M40 34.9A8.5 8.5 0 0 1 24 34.9" stroke="#34D399" stroke-width="2.2" stroke-linecap="round"/>
        <circle class="telemetry-pulse" cx="32" cy="32" r="5" stroke="#34D399" stroke-width="1.2"/>
        <circle cx="32" cy="32" r="2.8" fill="#FFFFFF"/>
        <circle cx="32" cy="12" r="2.2" fill="#A7F3D0"/>
        <circle cx="15" cy="42" r="2.2" fill="#A7F3D0"/>
        <circle cx="49" cy="42" r="2.2" fill="#34D399"/>
      </svg>
      <div class="brand-text">
        <span class="brand-title">Digital Twin Room</span>
        <span class="brand-sub">CLOSED-LOOP SMART LAB</span>
      </div>
    </div>
  `;
}

const ROOM_EMBLEMS = {
  computer: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="2"/>
      <path d="M8 20h8M12 16v4"/>
      <path d="M8 9l2 2-2 2M13 13h3"/>
    </svg>`,
  network: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="3" width="6" height="5" rx="1"/>
      <rect x="3" y="16" width="6" height="5" rx="1"/>
      <rect x="15" y="16" width="6" height="5" rx="1"/>
      <path d="M12 8v4m0 0H6v4m6-4h6v4"/>
    </svg>`,
  server: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="6" rx="1.5"/>
      <rect x="3" y="14" width="18" height="6" rx="1.5"/>
      <circle cx="7" cy="7" r="0.9" fill="currentColor"/>
      <circle cx="7" cy="17" r="0.9" fill="currentColor"/>
      <path d="M11 7h6M11 17h6"/>
    </svg>`,
  iot: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <rect x="7" y="7" width="10" height="10" rx="2"/>
      <path d="M9 4v3m6-3v3M9 17v3m6-3v3M4 9h3m-3 6h3M17 9h3m-3 6h3"/>
    </svg>`,
  classroom: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="11" rx="2"/>
      <path d="M8 20l4-5 4 5M12 15v5"/>
    </svg>`,
  default: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 21h16M6 21V7l6-4 6 4v14"/>
      <path d="M10 21v-5h4v5"/>
    </svg>`
};

const THEME_LABELS = {
  computer: "Lab Komputer & Pemrograman",
  network: "Lab Jaringan & Telekomunikasi",
  server: "Ruang Server & Data Center",
  iot: "Lab IoT & Elektronika",
  classroom: "Ruang Kelas & Seminar",
  default: "Ruangan Laboratorium Umum"
};

function detectRoomTheme(roomName = "", savedTheme = "auto") {
  if (savedTheme && savedTheme !== "auto" && ROOM_EMBLEMS[savedTheme]) {
    return savedTheme;
  }
  const name = roomName.toLowerCase();
  if (/komputer|rpl|coding|software|pc|multimedia|informatika/.test(name)) return "computer";
  if (/jaringan|network|cisco|mikrotik|telkom|router/.test(name)) return "network";
  if (/server|noc|data\s*center|cloud/.test(name)) return "server";
  if (/iot|elektronika|hardware|robot|mikro|sensor/.test(name)) return "iot";
  if (/kelas|kuliah|teori|rapat|seminar|dosen/.test(name)) return "classroom";
  return "default";
}

function renderRoomEmblem(roomName, savedTheme = "auto", sizeClass = "") {
  const key = detectRoomTheme(roomName, savedTheme);
  const extra = sizeClass ? ` ${sizeClass}` : "";
  return `<span class="room-emblem-box${extra}" title="${THEME_LABELS[key]}">${ROOM_EMBLEMS[key]}</span>`;
}

/* Harmonized Gradient Palette per Room Category + Thermal Condition (100% Static / Non-Animated) */
function resolveGradientStops(themeKey, status = "OPTIMAL") {
  if (status === "CRITICAL") {
    return { s0: "#fef5f5", s1: "#f9d6d6", s2: "#efb1b1", stroke: "#881337" };
  }
  if (status === "WARNING") {
    return { s0: "#fefaf1", s1: "#f8e4bc", s2: "#edc885", stroke: "#78350f" };
  }
  if (status === "COOLING") {
    return { s0: "#f1f9fe", s1: "#cde8f8", s2: "#a4d4f1", stroke: "#0c4a6e" };
  }
  if (status === "PAUSED") {
    return { s0: "#f8fafc", s1: "#e2e8f0", s2: "#cbd5e1", stroke: "#475569" };
  }

  // OPTIMAL state: Distinct architectural gradient palette per room type
  const palettes = {
    computer:  { s0: "#f2faf6", s1: "#d5efe3", s2: "#b0decb", stroke: "#0f3d34" },
    network:   { s0: "#f1f9fb", s1: "#cfeaf0", s2: "#a7d7e2", stroke: "#0e4f5c" },
    server:    { s0: "#f3f7fb", s1: "#d5e3f0", s2: "#b2cae0", stroke: "#1e3a5f" },
    iot:       { s0: "#f3faf2", s1: "#d7eed3", s2: "#b4dcb0", stroke: "#14532d" },
    classroom: { s0: "#f3faf7", s1: "#d8efe6", s2: "#b6ded0", stroke: "#0f3d34" },
    default:   { s0: "#f3faf7", s1: "#d8efe6", s2: "#b6ded0", stroke: "#0f3d34" }
  };
  return palettes[themeKey] || palettes.default;
}

/* Static (Non-Animated) Gradient Architectural Illustration per Room Theme */
function renderRoomGradientIllustration(roomName, savedTheme = "auto", uid = "0", status = "OPTIMAL") {
  const key = detectRoomTheme(roomName, savedTheme);
  const pal = resolveGradientStops(key, status);
  const gradId = `roomGrad_${key}_${uid}`;
  const glowId = `roomGlow_${key}_${uid}`;
  const st = pal.stroke;

  const sharedDefs = `
    <defs>
      <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${pal.s0}"/>
        <stop offset="52%" stop-color="${pal.s1}"/>
        <stop offset="100%" stop-color="${pal.s2}"/>
      </linearGradient>
      <radialGradient id="${glowId}" cx="78%" cy="32%" r="55%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="360" height="150" fill="url(#${gradId})"/>
    <rect width="360" height="150" fill="url(#${glowId})"/>
    <!-- Architectural Elevation Crosshairs & Dimension Ticks -->
    <path d="M135 0V150 M195 0V150 M255 0V150 M315 0V150 M100 45H360 M100 105H360" stroke="${st}" stroke-opacity="0.065" stroke-width="1"/>
    <path d="M336 14H346 M341 9V19" stroke="${st}" stroke-opacity="0.28" stroke-width="1.2" stroke-linecap="round"/>
  `;

  if (key === "computer") {
    return `
      <div class="room-card-backdrop" aria-hidden="true">
        <svg viewBox="0 0 360 150" preserveAspectRatio="xMaxYMid slice" xmlns="http://www.w3.org/2000/svg">
          ${sharedDefs}
          <!-- Background Floating IDE Window -->
          <rect x="234" y="14" width="108" height="66" rx="8" fill="#ffffff" fill-opacity="0.74" stroke="${st}" stroke-opacity="0.24" stroke-width="1.3"/>
          <circle cx="245" cy="23" r="2.3" fill="${st}" fill-opacity="0.45"/>
          <circle cx="253" cy="23" r="2.3" fill="#10b981" fill-opacity="0.65"/>
          <circle cx="261" cy="23" r="2.3" fill="${st}" fill-opacity="0.25"/>
          <path d="M245 36H282 M245 45H318 M253 54H304 M245 63H292" stroke="${st}" stroke-opacity="0.34" stroke-width="2" stroke-linecap="round"/>
          <!-- Primary Workstation Display -->
          <rect x="154" y="34" width="114" height="72" rx="8" fill="${st}" fill-opacity="0.14" stroke="${st}" stroke-opacity="0.44" stroke-width="1.8"/>
          <rect x="161" y="41" width="100" height="54" rx="4" fill="#ffffff" fill-opacity="0.82"/>
          <path d="M180 61L190 69L180 77 M198 77H222" stroke="${st}" stroke-opacity="0.68" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Stand & Studio Desk -->
          <path d="M201 106L196 122H226L221 106" fill="${st}" fill-opacity="0.26" stroke="${st}" stroke-opacity="0.44" stroke-width="1.4"/>
          <line x1="124" y1="123" x2="348" y2="123" stroke="${st}" stroke-opacity="0.36" stroke-width="2" stroke-linecap="round"/>
          <!-- Mini Tower / Edge Node -->
          <rect x="282" y="90" width="52" height="33" rx="5" fill="#ffffff" fill-opacity="0.65" stroke="${st}" stroke-opacity="0.34" stroke-width="1.4"/>
          <circle cx="294" cy="102" r="2.5" fill="${st}" fill-opacity="0.55"/>
          <path d="M303 102H323 M294 112H317" stroke="${st}" stroke-opacity="0.34" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
    `;
  }

  if (key === "network") {
    return `
      <div class="room-card-backdrop" aria-hidden="true">
        <svg viewBox="0 0 360 150" preserveAspectRatio="xMaxYMid slice" xmlns="http://www.w3.org/2000/svg">
          ${sharedDefs}
          <circle cx="272" cy="75" r="62" fill="none" stroke="${st}" stroke-opacity="0.1" stroke-width="1.2" stroke-dasharray="4 4"/>
          <circle cx="272" cy="75" r="38" fill="none" stroke="${st}" stroke-opacity="0.13" stroke-width="1.2"/>
          <!-- Orthogonal Topology Bus -->
          <path d="M242 44V68H183V96 M242 68H302V96 M242 68V96" fill="none" stroke="${st}" stroke-opacity="0.4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <!-- Core Gateway Router -->
          <rect x="208" y="18" width="68" height="26" rx="6" fill="#ffffff" fill-opacity="0.88" stroke="${st}" stroke-opacity="0.46" stroke-width="1.6"/>
          <circle cx="220" cy="31" r="2.5" fill="#0284c7"/>
          <circle cx="229" cy="31" r="2.5" fill="#10b981"/>
          <path d="M240 31H265" stroke="${st}" stroke-opacity="0.42" stroke-width="2" stroke-linecap="round"/>
          <!-- Distribution Switches -->
          <rect x="155" y="96" width="54" height="28" rx="6" fill="#ffffff" fill-opacity="0.85" stroke="${st}" stroke-opacity="0.42" stroke-width="1.5"/>
          <rect x="215" y="96" width="54" height="28" rx="6" fill="#ffffff" fill-opacity="0.85" stroke="${st}" stroke-opacity="0.42" stroke-width="1.5"/>
          <rect x="275" y="96" width="54" height="28" rx="6" fill="#ffffff" fill-opacity="0.85" stroke="${st}" stroke-opacity="0.42" stroke-width="1.5"/>
          <path d="M167 110H197 M227 110H257 M287 110H317" stroke="${st}" stroke-opacity="0.46" stroke-width="3" stroke-dasharray="4 3"/>
        </svg>
      </div>
    `;
  }

  if (key === "server") {
    return `
      <div class="room-card-backdrop" aria-hidden="true">
        <svg viewBox="0 0 360 150" preserveAspectRatio="xMaxYMid slice" xmlns="http://www.w3.org/2000/svg">
          ${sharedDefs}
          <path d="M138 132H346" stroke="${st}" stroke-opacity="0.34" stroke-width="2" stroke-linecap="round"/>
          ${[166, 224, 282].map((rx, idx) => `
            <g>
              <rect x="${rx}" y="22" width="46" height="110" rx="6" fill="${st}" fill-opacity="${0.13 + idx * 0.04}" stroke="${st}" stroke-opacity="0.46" stroke-width="1.6"/>
              <rect x="${rx + 6}" y="30" width="34" height="16" rx="3" fill="#ffffff" fill-opacity="0.85"/>
              <rect x="${rx + 6}" y="52" width="34" height="16" rx="3" fill="#ffffff" fill-opacity="0.85"/>
              <rect x="${rx + 6}" y="74" width="34" height="16" rx="3" fill="#ffffff" fill-opacity="0.85"/>
              <rect x="${rx + 6}" y="96" width="34" height="24" rx="3" fill="${st}" fill-opacity="0.16"/>
              <circle cx="${rx + 12}" cy="38" r="2" fill="#0284c7"/>
              <circle cx="${rx + 12}" cy="60" r="2" fill="#10b981"/>
              <circle cx="${rx + 12}" cy="82" r="2" fill="#0284c7"/>
              <path d="M${rx + 19} 38H${rx + 34} M${rx + 19} 60H${rx + 34} M${rx + 19} 82H${rx + 34}" stroke="${st}" stroke-opacity="0.42" stroke-width="1.6" stroke-linecap="round"/>
            </g>
          `).join("")}
        </svg>
      </div>
    `;
  }

  if (key === "iot") {
    return `
      <div class="room-card-backdrop" aria-hidden="true">
        <svg viewBox="0 0 360 150" preserveAspectRatio="xMaxYMid slice" xmlns="http://www.w3.org/2000/svg">
          ${sharedDefs}
          <path d="M145 48H210L226 64H248 M155 98H216L230 84H248 M298 64H336 M298 84H342" fill="none" stroke="${st}" stroke-opacity="0.32" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="145" cy="48" r="3" fill="${st}" fill-opacity="0.45"/>
          <circle cx="155" cy="98" r="3" fill="${st}" fill-opacity="0.45"/>
          <circle cx="336" cy="64" r="3" fill="#d97706" fill-opacity="0.65"/>
          <rect x="246" y="46" width="54" height="54" rx="10" fill="#ffffff" fill-opacity="0.88" stroke="${st}" stroke-opacity="0.48" stroke-width="1.8"/>
          <rect x="257" y="57" width="32" height="32" rx="5" fill="${st}" fill-opacity="0.16" stroke="${st}" stroke-opacity="0.4" stroke-width="1.2"/>
          <path d="M261 38V46 M273 38V46 M285 38V46 M261 100V108 M273 100V108 M285 100V108" stroke="${st}" stroke-opacity="0.48" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    `;
  }

  return `
    <div class="room-card-backdrop" aria-hidden="true">
      <svg viewBox="0 0 360 150" preserveAspectRatio="xMaxYMid slice" xmlns="http://www.w3.org/2000/svg">
        ${sharedDefs}
        <rect x="184" y="22" width="138" height="68" rx="8" fill="#ffffff" fill-opacity="0.86" stroke="${st}" stroke-opacity="0.4" stroke-width="1.6"/>
        <path d="M202 42H286 M202 54H304 M202 66H262" stroke="${st}" stroke-opacity="0.34" stroke-width="2" stroke-linecap="round"/>
        <rect x="162" y="104" width="66" height="22" rx="5" fill="${st}" fill-opacity="0.15" stroke="${st}" stroke-opacity="0.36" stroke-width="1.4"/>
        <rect x="244" y="104" width="66" height="22" rx="5" fill="${st}" fill-opacity="0.15" stroke="${st}" stroke-opacity="0.36" stroke-width="1.4"/>
      </svg>
    </div>
  `;
}

/* Architectural Blueprint 2D Digital Twin */
function renderArchitecturalTwin(containerEl, room, latest) {
  if (!containerEl || !room || !latest) return;
  const theme = detectRoomTheme(room.name, room.theme);
  const temp = Number(latest.temperature || 24);
  const hum = Number(latest.humidity || 55);
  const occ = Number(latest.occupancy || 0);
  const cap = Math.max(1, Number(room.capacity || 30));
  const cooling = Number(latest.ac_state || 0) === 1;
  const status = latest.status || "OPTIMAL";

  let floorFill = "#f9fcfa";
  let wallColor = "#16302b";
  let tempDotColor = "#10b981";
  let tempTextColor = "#0f3d34";

  if (status === "CRITICAL") {
    floorFill = "#fef6f6";
    wallColor = "#991b1b";
    tempDotColor = "#dc2626";
    tempTextColor = "#b91c1c";
  } else if (status === "WARNING") {
    floorFill = "#fffbeb";
    wallColor = "#92400e";
    tempDotColor = "#f59e0b";
    tempTextColor = "#b45309";
  } else if (cooling) {
    floorFill = "#f2f9fe";
    wallColor = "#0c4a6e";
    tempDotColor = "#0284c7";
    tempTextColor = "#0369a1";
  }

  const frontFixtureLabel =
    theme === "server" ? "CORE PDU & MONITORING RACK" :
    theme === "network" ? "RACK ROUTER, SWITCH & PATCH PANEL" :
    theme === "iot" ? "PAPAN SKEMATIK & POWER SUPPLY BENCH" :
    "PAPAN TULIS & PROYEKTOR";

  const instructorDeskLabel =
    theme === "server" ? "Console" :
    theme === "iot" ? "Meja Laboran" : "Meja Dosen";

  let stationsSvg = "";
  const seatCoords = [];

  if (theme === "server") {
    for (let i = 0; i < 4; i++) {
      const rx = 104 + i * 74;
      const ry = 82;
      stationsSvg += `
        <g>
          <rect x="${rx}" y="${ry}" width="52" height="96" rx="5" fill="#133830" stroke="#0f2923" stroke-width="1.5"/>
          <rect x="${rx + 6}" y="${ry + 8}" width="40" height="14" rx="2" fill="#1d4d42"/>
          <rect x="${rx + 6}" y="${ry + 28}" width="40" height="14" rx="2" fill="#1d4d42"/>
          <rect x="${rx + 6}" y="${ry + 48}" width="40" height="14" rx="2" fill="#1d4d42"/>
          <circle cx="${rx + 12}" cy="${ry + 15}" r="2.2" fill="#34d399"/>
          <circle cx="${rx + 12}" cy="${ry + 35}" r="2.2" fill="${cooling ? '#38bdf8' : '#fbbf24'}"/>
          <circle cx="${rx + 12}" cy="${ry + 55}" r="2.2" fill="#34d399"/>
          <text x="${rx + 26}" y="${ry + 82}" text-anchor="middle" font-size="8" font-family="monospace" fill="#a7f3d0">RACK-0${i + 1}</text>
        </g>
      `;
      seatCoords.push([rx + 26, ry + 110]);
    }
  } else {
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        const dx = 102 + col * 74;
        const dy = 86 + row * 68;

        let deviceOnDesk = "";
        if (theme === "computer") {
          deviceOnDesk = `
            <rect x="${dx + 14}" y="${dy + 4}" width="24" height="11" rx="2" fill="#233b35"/>
            <rect x="${dx + 17}" y="${dy + 6}" width="18" height="6" rx="1" fill="#6ee7b7" opacity="0.7"/>
          `;
        } else if (theme === "network") {
          deviceOnDesk = `
            <rect x="${dx + 11}" y="${dy + 5}" width="30" height="10" rx="2" fill="#1e3a5f"/>
            <circle cx="${dx + 16}" cy="${dy + 10}" r="1.5" fill="#38bdf8"/>
            <circle cx="${dx + 21}" cy="${dy + 10}" r="1.5" fill="#34d399"/>
            <circle cx="${dx + 26}" cy="${dy + 10}" r="1.5" fill="#fbbf24"/>
          `;
        } else if (theme === "iot") {
          deviceOnDesk = `
            <rect x="${dx + 13}" y="${dy + 5}" width="14" height="10" rx="1.5" fill="#065f46"/>
            <rect x="${dx + 30}" y="${dy + 6}" width="10" height="8" rx="1.5" fill="#d97706"/>
          `;
        } else {
          deviceOnDesk = `
            <rect x="${dx + 17}" y="${dy + 5}" width="18" height="11" rx="1.5" fill="#ffffff" stroke="#94a3b8" stroke-width="1"/>
          `;
        }

        stationsSvg += `
          <g>
            <rect x="${dx + 14}" y="${dy + 24}" width="24" height="6" rx="3" fill="#cbd5e1"/>
            <rect x="${dx}" y="${dy}" width="52" height="22" rx="4" fill="#e9cfa8" stroke="#b99665" stroke-width="1.3"/>
            ${deviceOnDesk}
          </g>
        `;
        seatCoords.push([dx + 26, dy + 27]);
      }
    }
  }

  const activeSeats = occ <= 0 ? 0 : Math.min(seatCoords.length, Math.max(1, Math.round((occ / cap) * seatCoords.length)));
  let occupantsSvg = "";
  for (let i = 0; i < activeSeats; i++) {
    const [sx, sy] = seatCoords[i];
    occupantsSvg += `
      <g class="occupant-node">
        <circle cx="${sx}" cy="${sy}" r="6.5" fill="#0f3d34" stroke="#ffffff" stroke-width="1.8"/>
        <circle cx="${sx}" cy="${sy}" r="2.2" fill="#34d399"/>
      </g>
    `;
  }

  const acAirflowSvg = cooling ? `
    <g>
      <path class="ac-airflow-line" d="M56 42 Q125 32 195 52" fill="none" stroke="#0284c7" stroke-width="2.2" stroke-dasharray="6 6" stroke-linecap="round"/>
      <path class="ac-airflow-line" d="M56 50 Q135 55 210 85" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 6" stroke-linecap="round"/>
      <path class="ac-airflow-line" d="M56 58 Q115 78 165 118" fill="none" stroke="#7dd3fc" stroke-width="1.8" stroke-dasharray="5 6" stroke-linecap="round"/>
    </g>
  ` : "";

  containerEl.innerHTML = `
    <svg viewBox="0 0 460 272" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="bpGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(15, 61, 52, 0.05)" stroke-width="1"/>
        </pattern>
        <filter id="pillShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#0f3d34" flood-opacity="0.10"/>
        </filter>
      </defs>

      <rect x="26" y="16" width="404" height="236" rx="6" fill="${floorFill}" stroke="${wallColor}" stroke-width="3"/>
      <rect x="28" y="18" width="400" height="232" fill="url(#bpGrid)"/>

      <rect x="132" y="19" width="192" height="17" rx="3" fill="#ffffff" stroke="#9fb5ae" stroke-width="1.2"/>
      <text x="228" y="30.5" text-anchor="middle" font-size="8.2" font-weight="700" font-family="Inter, sans-serif" letter-spacing="0.04em" fill="#354f49">
        ${frontFixtureLabel}
      </text>

      <rect x="426" y="58" width="6" height="136" fill="#bae6fd" stroke="#0284c7" stroke-width="1.2"/>
      <text x="441" y="126" text-anchor="middle" font-size="8" font-weight="700" font-family="monospace" fill="#526963" transform="rotate(90 441 126)">
        JENDELA
      </text>

      <path d="M38 252 A32 32 0 0 1 70 220" fill="none" stroke="#788f89" stroke-width="1.3" stroke-dasharray="3 3"/>
      <line x1="38" y1="252" x2="38" y2="220" stroke="${wallColor}" stroke-width="3"/>
      <text x="64" y="245" font-size="8" font-weight="700" font-family="monospace" fill="#354f49">PINTU MASUK</text>

      <rect x="30" y="32" width="24" height="36" rx="4" fill="${cooling ? '#0284c7' : '#ffffff'}" stroke="${cooling ? '#0369a1' : '#94a3b8'}" stroke-width="1.5"/>
      <text x="42" y="53" text-anchor="middle" font-size="8.5" font-weight="800" font-family="monospace" fill="${cooling ? '#ffffff' : '#334155'}">AC</text>
      ${acAirflowSvg}

      <rect x="36" y="76" width="46" height="24" rx="4" fill="#e9cfa8" stroke="#b99665" stroke-width="1.2"/>
      <text x="59" y="91" text-anchor="middle" font-size="7.5" font-weight="600" font-family="Inter, sans-serif" fill="#4a3723">${instructorDeskLabel}</text>

      ${stationsSvg}
      ${occupantsSvg}

      <g filter="url(#pillShadow)">
        <rect x="304" y="44" width="110" height="40" rx="8" fill="#ffffff" stroke="#d5e2dd" stroke-width="1.2"/>
        <circle class="sensor-beacon-ring" cx="316" cy="57" r="3.5" fill="none" stroke="${tempDotColor}" stroke-width="1.5"/>
        <circle cx="316" cy="57" r="3.5" fill="${tempDotColor}"/>
        <text x="325" y="60" font-size="8.5" font-weight="600" font-family="Inter, sans-serif" fill="#526963">Sensor Suhu</text>
        <text x="315" y="76" font-size="13" font-weight="800" font-family="Inter, sans-serif" fill="${tempTextColor}">${temp.toFixed(1)} °C</text>
      </g>

      <g filter="url(#pillShadow)">
        <rect x="44" y="156" width="118" height="40" rx="8" fill="#ffffff" stroke="#d5e2dd" stroke-width="1.2"/>
        <circle class="sensor-beacon-ring" cx="56" cy="169" r="3.5" fill="none" stroke="#0284c7" stroke-width="1.5"/>
        <circle cx="56" cy="169" r="3.5" fill="#0284c7"/>
        <text x="65" y="172" font-size="8.5" font-weight="600" font-family="Inter, sans-serif" fill="#526963">Sensor Kelembapan</text>
        <text x="55" y="188" font-size="13" font-weight="800" font-family="Inter, sans-serif" fill="#0f241f">${hum.toFixed(0)} % RH</text>
      </g>

      <g filter="url(#pillShadow)">
        <rect x="256" y="202" width="154" height="40" rx="8" fill="#ffffff" stroke="#d5e2dd" stroke-width="1.2"/>
        <circle class="sensor-beacon-ring" cx="268" cy="215" r="3.5" fill="none" stroke="#10b981" stroke-width="1.5"/>
        <circle cx="268" cy="215" r="3.5" fill="#10b981"/>
        <text x="277" y="218" font-size="8.5" font-weight="600" font-family="Inter, sans-serif" fill="#526963">Sensor Gerak (PIR)</text>
        <text x="267" y="234" font-size="11.5" font-weight="800" font-family="Inter, sans-serif" fill="#0f241f">
          ${occ > 0 ? `Ada orang (${occ}/${cap})` : `Kosong (0/${cap})`}
        </text>
      </g>
    </svg>
  `;
}

/* Offline-Capable High-DPI Canvas Telemetry Chart */
function renderTelemetryChart(canvasEl, history, thresholds) {
  if (!canvasEl || !history || history.length === 0) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvasEl.getBoundingClientRect();
  const width = Math.max(300, rect.width);
  const height = Math.max(220, rect.height);

  canvasEl.width = width * dpr;
  canvasEl.height = height * dpr;
  const ctx = canvasEl.getContext("2d");
  ctx.scale(dpr, dpr);

  const pad = { top: 28, right: 20, bottom: 30, left: 42 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  ctx.clearRect(0, 0, width, height);

  const temps = history.map(d => Number(d.temperature));
  const hums = history.map(d => Number(d.humidity));
  const tempOn = thresholds ? Number(thresholds.temp_on) : 26.5;

  const minVal = 15;
  const maxVal = 90;

  const yPos = (val) => pad.top + plotH - ((val - minVal) / (maxVal - minVal)) * plotH;
  const xPos = (idx) => pad.left + (history.length === 1 ? plotW / 2 : (idx / (history.length - 1)) * plotW);

  ctx.strokeStyle = "#e6efec";
  ctx.lineWidth = 1;
  [20, 40, 60, 80].forEach(v => {
    const y = yPos(v);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();

    ctx.fillStyle = "#788f89";
    ctx.font = "10px monospace";
    ctx.fillText(`${v}`, 10, y + 3);
  });

  const yThresh = yPos(tempOn);
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(pad.left, yThresh);
  ctx.lineTo(width - pad.right, yThresh);
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  hums.forEach((h, i) => {
    const x = xPos(i);
    const y = yPos(h);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.strokeStyle = "#0f3d34";
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  temps.forEach((t, i) => {
    const x = xPos(i);
    const y = yPos(t);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  const lastX = xPos(temps.length - 1);
  const lastY = yPos(temps[temps.length - 1]);
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(lastX, lastY, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "600 11px Inter, sans-serif";
  ctx.fillStyle = "#0f3d34";
  ctx.fillText(`● Suhu (${temps[temps.length - 1].toFixed(1)}°C)`, pad.left, 15);
  ctx.fillStyle = "#0284c7";
  ctx.fillText(`● Kelembapan (${hums[hums.length - 1].toFixed(0)}%)`, pad.left + 115, 15);
  ctx.fillStyle = "#d97706";
  ctx.fillText(`-- Batas AC (${tempOn}°C)`, pad.left + 245, 15);

  ctx.fillStyle = "#788f89";
  ctx.font = "10px monospace";
  const firstTime = (history[0].recorded_at || "").slice(-8);
  const lastTime = (history[history.length - 1].recorded_at || "").slice(-8);
  ctx.fillText(firstTime, pad.left, height - 8);
  ctx.fillText(lastTime, width - pad.right - 52, height - 8);
}
