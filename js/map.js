// Sky Ledger — Phase A map (Bangalore region)

const sites = [
  {
    name: "Central Bangalore",
    lat: 12.9716,
    lng: 77.5946,
    bortle: 9,
    sqm: 17.8,
    stars: "~150",
    targets: "Moon & planets only",
    rec: "4–5\" refractor or Maksutov. Compact, balcony-friendly, and matched to what the sky actually offers."
  },
  {
    name: "Whitefield / East Bangalore",
    lat: 12.9698,
    lng: 77.7500,
    bortle: 8,
    sqm: 18.2,
    stars: "~200",
    targets: "Moon, planets, brightest clusters",
    rec: "5–6\" refractor or small SCT. Still heavily light-polluted — prioritise contrast and portability."
  },
  {
    name: "Nandi Hills",
    lat: 13.3702,
    lng: 77.6835,
    bortle: 5,
    sqm: 20.1,
    stars: "~800",
    targets: "Brighter clusters, double stars, some nebulae",
    rec: "6–8\" Dobsonian. Worth the drive for a real improvement, though Bangalore’s glow still affects the southern sky."
  },
  {
    name: "Skandagiri",
    lat: 13.4180,
    lng: 77.6960,
    bortle: 5,
    sqm: 20.0,
    stars: "~700–900",
    targets: "Similar to Nandi Hills",
    rec: "6–8\" Dobsonian. Good intermediate option if you already visit this area."
  },
  {
    name: "Denkanikottai area",
    lat: 12.5200,
    lng: 77.7800,
    bortle: 3,
    sqm: 21.4,
    stars: "~2,500+",
    targets: "Galaxies, nebulae, detailed Milky Way",
    rec: "8–10\" Dobsonian. This is where larger aperture finally starts to pay off."
  },
  {
    name: "Hosur outskirts",
    lat: 12.7400,
    lng: 77.8300,
    bortle: 4,
    sqm: 20.7,
    stars: "~1,500",
    targets: "Clusters and brighter deep-sky objects",
    rec: "8\" Dobsonian. A practical dark-sky option with a shorter drive than Denkanikottai."
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

function initMap() {
  const map = L.map("map", {
    center: [12.97, 77.65],
    zoom: 9,
    zoomControl: true
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(map);

  const panelEmpty = document.getElementById("mapPanelEmpty");
  const panelContent = document.getElementById("mapPanelContent");

  sites.forEach((site) => {
    const color = bortleColors[site.bortle] || "#8D97B8";

    const marker = L.circleMarker([site.lat, site.lng], {
      radius: 10,
      fillColor: color,
      color: "#EDEFF6",
      weight: 1.5,
      opacity: 0.95,
      fillOpacity: 0.85
    }).addTo(map);

    marker.bindTooltip(site.name, {
      direction: "top",
      offset: [0, -8]
    });

    marker.on("click", () => {
      panelEmpty.hidden = true;
      panelContent.hidden = false;

      document.getElementById("panelLoc").textContent = site.name;
      document.getElementById("panelBortle").textContent = `Bortle ${site.bortle}`;
      document.getElementById("panelSqm").textContent = site.sqm;
      document.getElementById("panelStars").textContent = site.stars;
      document.getElementById("panelTargets").textContent = `Best targets: ${site.targets}`;
      document.getElementById("panelRec").textContent = site.rec;
    });
  });
}

document.addEventListener("DOMContentLoaded", initMap);
