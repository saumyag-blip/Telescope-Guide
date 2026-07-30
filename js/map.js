// Sky Ledger — Phase B + C map (Bangalore region)
// Modes: Sky Quality | Telescope Guide

const sites = [
  {
    name: "Central Bangalore",
    lat: 12.9716,
    lng: 77.5946,
    bortle: 9,
    sqm: 17.8,
    stars: "~150",
    targets: "Moon & planets only",
    type: "city",
    apertureIn: 4.5,
    scopeClass: "Refractor / Maksutov",
    rec: {
      visual: "4–5\" refractor or Maksutov. Compact and matched to what the sky actually offers.",
      astro: "Small refractor + tracking mount. Narrowband filters become almost essential here."
    }
  },
  {
    name: "Whitefield / East Bangalore",
    lat: 12.9698,
    lng: 77.7500,
    bortle: 8,
    sqm: 18.2,
    stars: "~200",
    targets: "Moon, planets, brightest clusters",
    type: "city",
    apertureIn: 5.5,
    scopeClass: "Refractor / small SCT",
    rec: {
      visual: "5–6\" refractor or small SCT. Prioritise contrast and portability.",
      astro: "5–6\" refractor with a good mount. Light pollution filters help a lot."
    }
  },
  {
    name: "Nandi Hills",
    lat: 13.3702,
    lng: 77.6835,
    bortle: 5,
    sqm: 20.1,
    stars: "~800",
    targets: "Brighter clusters, double stars, some nebulae",
    type: "intermediate",
    apertureIn: 7,
    scopeClass: "6–8\" Dobsonian",
    rec: {
      visual: "6–8\" Dobsonian. Worth the drive for a real improvement over the city.",
      astro: "6–8\" scope on a tracking mount. Still affected by Bangalore’s southern glow."
    }
  },
  {
    name: "Skandagiri",
    lat: 13.4180,
    lng: 77.6960,
    bortle: 5,
    sqm: 20.0,
    stars: "~700–900",
    targets: "Similar to Nandi Hills",
    type: "intermediate",
    apertureIn: 7,
    scopeClass: "6–8\" Dobsonian",
    rec: {
      visual: "6–8\" Dobsonian. Good intermediate option if you already visit this area.",
      astro: "Similar to Nandi Hills — usable but not truly dark."
    }
  },
  {
    name: "Denkanikottai area",
    lat: 12.5200,
    lng: 77.7800,
    bortle: 3,
    sqm: 21.4,
    stars: "~2,500+",
    targets: "Galaxies, nebulae, detailed Milky Way",
    type: "dark",
    apertureIn: 10,
    scopeClass: "8–12\" Dobsonian",
    rec: {
      visual: "8–10\" Dobsonian. This is where larger aperture finally starts to pay off.",
      astro: "8–10\" scope on a solid equatorial mount. Excellent for broadband and narrowband work."
    }
  },
  {
    name: "Hosur outskirts",
    lat: 12.7400,
    lng: 77.8300,
    bortle: 4,
    sqm: 20.7,
    stars: "~1,500",
    targets: "Clusters and brighter deep-sky objects",
    type: "intermediate",
    apertureIn: 8,
    scopeClass: "8\" Dobsonian",
    rec: {
      visual: "8\" Dobsonian. A practical dark-sky option with a shorter drive.",
      astro: "8\" scope works well here for many deep-sky targets."
    }
  }
];

const bortleColors = {
  1: "#17405a",
  2: "#17405a",
  3: "#1c6e6e",
  4: "#1c6e6e",
  5: "#c9a227",
  6: "#c9a227",
  7: "#d97a2b",
  8: "#d94f2b",
  9: "#d94f2b"
};

// Simple polygon zones (approx. Bangalore region) — telescope-type guidance
const zones = [
  {
    name: "Urban core",
    type: "city",
    color: "#d94f2b",
    coords: [
      [12.85, 77.45],
      [12.85, 77.72],
      [13.10, 77.72],
      [13.10, 77.45]
    ]
  },
  {
    name: "Eastern suburbs",
    type: "suburban",
    color: "#c9a227",
    coords: [
      [12.88, 77.72],
      [12.88, 77.90],
      [13.08, 77.90],
      [13.08, 77.72]
    ]
  },
  {
    name: "Northern hills belt",
    type: "intermediate",
    color: "#1c6e6e",
    coords: [
      [13.25, 77.55],
      [13.25, 77.85],
      [13.50, 77.85],
      [13.50, 77.55]
    ]
  },
  {
    name: "Southern dark belt",
    type: "dark",
    color: "#17405a",
    coords: [
      [12.40, 77.60],
      [12.40, 77.95],
      [12.70, 77.95],
      [12.70, 77.60]
    ]
  }
];

let map, bortleLayer, darkSiteLayer, zoneLayer, apertureLayer;
let currentSite = null;
let currentMode = "sky"; // "sky" | "guide"

function getFilters() {
  if (currentMode === "guide") {
    return {
      budget: document.getElementById("filterBudget").value,
      portability: document.getElementById("filterPortability").value,
      experience: document.getElementById("filterExperience").value,
      interest: document.getElementById("filterGuideInterest").value,
      targets: document.getElementById("filterGuideTargets").value
    };
  }
  return {
    budget: "any",
    portability: "any",
    experience: "any",
    interest: document.getElementById("filterInterest").value,
    targets: document.getElementById("filterTargets").value
  };
}

/**
 * Live recommendation logic — adjusts base site rec by the five filters.
 */
function getRecommendation(site) {
  const f = getFilters();
  let text = site.rec[f.interest] || site.rec.visual;
  const notes = [];

  // Budget
  if (f.budget === "low") {
    if (site.apertureIn >= 8) {
      notes.push("At this budget, favour a used 6–8\" Dob or a solid pair of binoculars over new large glass.");
    } else {
      notes.push("A quality 70–90mm refractor or entry Dob fits this budget well.");
    }
  } else if (f.budget === "mid") {
    notes.push("Mid-range budget opens reliable 6–8\" Dobs and small GoTo SCTs.");
  } else if (f.budget === "high") {
    if (site.bortle <= 4) {
      notes.push("Budget allows a larger Dob or a tracking mount — the sky here can use it.");
    } else {
      notes.push("Spend on mount quality and filters rather than raw aperture under bright skies.");
    }
  }

  // Portability
  if (f.portability === "grab") {
    notes.push("Keep it under ~5\" refractor or a compact Mak — balcony- and backpack-friendly.");
  } else if (f.portability === "car") {
    notes.push("Car-portable allows a full-size 8–10\" Dob with a short drive.");
  } else if (f.portability === "fixed") {
    notes.push("Fixed setup: prioritise aperture and a permanent pier or observatory shed.");
  }

  // Experience
  if (f.experience === "beginner") {
    notes.push("Start simple: Dob or refractor without GoTo complexity; learn the sky first.");
  } else if (f.experience === "advanced") {
    notes.push("Advanced path: collimation practice, filters, and optional imaging train.");
  }

  // Targets
  if (f.targets === "planets") {
    notes.push("Especially strong for lunar and planetary work — prioritise optical quality over aperture.");
  } else if (f.targets === "dso") {
    if (site.bortle >= 7) {
      notes.push("Deep-sky objects will be very limited from this location — plan dark-sky trips.");
    } else if (site.bortle >= 5) {
      notes.push("Brighter deep-sky objects are realistic here.");
    } else {
      notes.push("Excellent for a wide range of deep-sky objects.");
    }
  }

  if (notes.length) {
    text += " " + notes.join(" ");
  }
  return text;
}

function getMatchedScope(site) {
  const f = getFilters();
  let aperture = site.apertureIn;
  let scopeClass = site.scopeClass;

  if (f.portability === "grab") {
    aperture = Math.min(aperture, 5);
    scopeClass = "Compact refractor / Mak";
  } else if (f.portability === "fixed" && site.bortle <= 4) {
    aperture = Math.max(aperture, 10);
    scopeClass = "Large Dob / observatory SCT";
  }

  if (f.budget === "low") {
    aperture = Math.min(aperture, 6);
  }

  if (f.interest === "astro" && site.bortle >= 7) {
    scopeClass = "Small refractor + tracking mount";
  }

  return {
    apertureLabel: aperture % 1 === 0 ? `${aperture}"` : `${aperture}"`,
    scopeClass
  };
}

function updatePanel(site) {
  currentSite = site;
  document.getElementById("mapPanelEmpty").hidden = true;
  document.getElementById("mapPanelContent").hidden = false;

  document.getElementById("panelLoc").textContent = site.name;
  document.getElementById("panelBortle").textContent = `Bortle ${site.bortle}`;
  document.getElementById("panelSqm").textContent = site.sqm;
  document.getElementById("panelStars").textContent = site.stars;
  document.getElementById("panelTargets").textContent = `Best targets: ${site.targets}`;
  document.getElementById("panelRec").textContent = getRecommendation(site);

  const scopeBlock = document.getElementById("panelScope");
  if (currentMode === "guide") {
    const matched = getMatchedScope(site);
    scopeBlock.hidden = false;
    document.getElementById("panelScopeType").textContent = matched.scopeClass;
    document.getElementById("panelScopeAperture").textContent =
      `Suggested aperture · ${matched.apertureLabel}`;
  } else {
    scopeBlock.hidden = true;
  }
}

function buildApertureBubbles() {
  apertureLayer.clearLayers();
  sites.forEach((site) => {
    const matched = getMatchedScope(site);
    const radius = 8 + matched.apertureLabel.replace('"', "") * 1.8;
    const color = bortleColors[site.bortle] || "#8D97B8";

    const bubble = L.circleMarker([site.lat, site.lng], {
      radius: Math.min(radius, 28),
      fillColor: color,
      color: "#EDEFF6",
      weight: 1.5,
      opacity: 0.95,
      fillOpacity: 0.35
    });

    bubble.bindTooltip(`${site.name} · ${matched.apertureLabel}`, {
      direction: "top",
      offset: [0, -8]
    });
    bubble.on("click", () => updatePanel(site));
    apertureLayer.addLayer(bubble);

    const label = L.marker([site.lat, site.lng], {
      icon: L.divIcon({
        className: "",
        html: `<div class="aperture-label">${matched.apertureLabel}</div>`,
        iconSize: [48, 22],
        iconAnchor: [24, -6]
      }),
      interactive: false
    });
    apertureLayer.addLayer(label);
  });
}

function setMode(mode) {
  currentMode = mode;

  document.getElementById("modeSky").classList.toggle("is-active", mode === "sky");
  document.getElementById("modeGuide").classList.toggle("is-active", mode === "guide");
  document.getElementById("modeSky").setAttribute("aria-selected", mode === "sky");
  document.getElementById("modeGuide").setAttribute("aria-selected", mode === "guide");

  document.getElementById("controlsSky").hidden = mode !== "sky";
  document.getElementById("controlsGuide").hidden = mode !== "guide";
  document.getElementById("mapLegend").hidden = mode !== "guide";

  if (mode === "sky") {
    map.addLayer(bortleLayer);
    map.addLayer(darkSiteLayer);
    map.removeLayer(zoneLayer);
    map.removeLayer(apertureLayer);
    // Restore layer toggles
    const tB = document.getElementById("toggleBortle");
    const tD = document.getElementById("toggleDarkSites");
    if (!tB.checked) map.removeLayer(bortleLayer);
    if (!tD.checked) map.removeLayer(darkSiteLayer);
  } else {
    map.removeLayer(bortleLayer);
    map.removeLayer(darkSiteLayer);
    map.addLayer(zoneLayer);
    buildApertureBubbles();
    map.addLayer(apertureLayer);
  }

  if (currentSite) updatePanel(currentSite);

  document.getElementById("mapPanelEmpty").textContent =
    mode === "sky"
      ? "Click a marker on the map to see sky quality and telescope guidance."
      : "Click a bubble to see a filter-matched scope recommendation for that site.";
}

function initMap() {
  map = L.map("map", {
    center: [12.97, 77.65],
    zoom: 9,
    zoomControl: true
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(map);

  bortleLayer = L.layerGroup().addTo(map);
  darkSiteLayer = L.layerGroup().addTo(map);
  zoneLayer = L.layerGroup();
  apertureLayer = L.layerGroup();

  // Zones (Telescope Guide mode)
  zones.forEach((z) => {
    const poly = L.polygon(z.coords, {
      color: z.color,
      weight: 1.5,
      opacity: 0.7,
      fillColor: z.color,
      fillOpacity: 0.12
    });
    poly.bindTooltip(z.name, { sticky: true });
    zoneLayer.addLayer(poly);
  });

  // Bortle markers (Sky Quality mode)
  sites.forEach((site) => {
    const color = bortleColors[site.bortle] || "#8D97B8";

    const marker = L.circleMarker([site.lat, site.lng], {
      radius: 10,
      fillColor: color,
      color: "#EDEFF6",
      weight: 1.5,
      opacity: 0.95,
      fillOpacity: 0.85
    });

    marker.bindTooltip(site.name, {
      direction: "top",
      offset: [0, -8]
    });
    marker.on("click", () => updatePanel(site));
    bortleLayer.addLayer(marker);

    if (site.type === "dark") {
      const darkIcon = L.divIcon({
        className: "",
        html: `<div class="dark-site-label">★ Dark site</div>`,
        iconSize: [90, 24],
        iconAnchor: [45, 40]
      });
      const darkMarker = L.marker([site.lat, site.lng], { icon: darkIcon });
      darkMarker.on("click", () => updatePanel(site));
      darkSiteLayer.addLayer(darkMarker);
    }
  });

  // Mode buttons
  document.getElementById("modeSky").addEventListener("click", () => setMode("sky"));
  document.getElementById("modeGuide").addEventListener("click", () => setMode("guide"));

  // Sky Quality layer toggles
  document.getElementById("toggleBortle").addEventListener("change", (e) => {
    if (currentMode !== "sky") return;
    if (e.target.checked) map.addLayer(bortleLayer);
    else map.removeLayer(bortleLayer);
  });

  document.getElementById("toggleDarkSites").addEventListener("change", (e) => {
    if (currentMode !== "sky") return;
    if (e.target.checked) map.addLayer(darkSiteLayer);
    else map.removeLayer(darkSiteLayer);
  });

  // Live filter updates
  const filterIds = [
    "filterTargets",
    "filterInterest",
    "filterBudget",
    "filterPortability",
    "filterExperience",
    "filterGuideInterest",
    "filterGuideTargets"
  ];
  filterIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("change", () => {
      if (currentMode === "guide") buildApertureBubbles();
      if (currentSite) updatePanel(currentSite);
    });
  });
}

document.addEventListener("DOMContentLoaded", initMap);
