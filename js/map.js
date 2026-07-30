// Sky Ledger — Phase B map (Bangalore region)

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

let map, bortleLayer, darkSiteLayer;
let currentSite = null;

function getRecommendation(site) {
  const interest = document.getElementById("filterInterest").value;
  const targets = document.getElementById("filterTargets").value;

  let text = site.rec[interest] || site.rec.visual;

  if (targets === "planets") {
    text += " Especially strong for lunar and planetary work.";
  } else if (targets === "dso") {
    if (site.bortle >= 7) {
      text += " Deep-sky objects will be very limited from this location.";
    } else if (site.bortle >= 5) {
      text += " Brighter deep-sky objects are realistic here.";
    } else {
      text += " Excellent for a wide range of deep-sky objects.";
    }
  }

  return text;
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
}

function initMap() {
  map = L.map("map", {
    center: [12.97, 77.65],
    zoom: 9,
    zoomControl: true
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(map);

  bortleLayer = L.layerGroup().addTo(map);
  darkSiteLayer = L.layerGroup().addTo(map);

  sites.forEach((site) => {
    const color = bortleColors[site.bortle] || "#8D97B8";

    // Normal Bortle marker
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

    // Extra emphasis for true dark sites
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

  // Toggles
  document.getElementById("toggleBortle").addEventListener("change", (e) => {
    if (e.target.checked) {
      map.addLayer(bortleLayer);
    } else {
      map.removeLayer(bortleLayer);
    }
  });

  document.getElementById("toggleDarkSites").addEventListener("change", (e) => {
    if (e.target.checked) {
      map.addLayer(darkSiteLayer);
    } else {
      map.removeLayer(darkSiteLayer);
    }
  });

  // Filters – update recommendation live if a site is selected
  document.getElementById("filterTargets").addEventListener("change", () => {
    if (currentSite) updatePanel(currentSite);
  });

  document.getElementById("filterInterest").addEventListener("change", () => {
    if (currentSite) updatePanel(currentSite);
  });
}

document.addEventListener("DOMContentLoaded", initMap);
