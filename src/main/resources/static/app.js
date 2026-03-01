// TEMP
console.log("app.js loaded");

let previousLocations = null;

document.addEventListener("DOMContentLoaded", () => {
    fetchLocations();
    setInterval(fetchLocations, 300000); // 300000 = 5min
});

async function fetchLocations() {
    try {
        // Fetch data
        const response = await fetch('/api/locations');
        const locations = await response.json();

        if (previousLocations && JSON.stringify(locations) === JSON.stringify(previousLocations)) {
            console.log("No changes detected. Skipping re-render");
            return;
        }
        console.log("Data changed. Updating UI.");
        previousLocations = locations;

        // Render top-level type view
        renderTypeView(locations);

    } catch (error) {
        console.error("Error fetching data:", error);
        const container = document.getElementById("view-container");
        container.innerHTML = `<div class="col-12"><div class="card p-4">Error loading data.</div></div>`;
    }
}

// Progress bar color
function getProgressBarColor(percent) {
    if (percent < 50) return 'bg-success';
    if (percent < 80) return 'bg-warning';
    return 'bg-danger';
}

// Current app state
let currentView = "type";
let selectedType = null;
let selectedFacility = null;

// crude type detection using keywords so "Lied" / "Beyer" still map to Gym
function detectType(facilityName = "") {
    const name = facilityName.toLowerCase();
    const gymKeywords = ['gym', 'rec', 'recreation', 'fieldhouse', 'arena', 'fitness', 'beyer', 'lied', 'recreation center', 'rec center', 'recctr'];
    const libraryKeywords = ['lib', 'library', 'esports', 'media', 'study'];

    if (gymKeywords.some(k => name.includes(k))) return 'Gym';
    if (libraryKeywords.some(k => name.includes(k))) return 'Library';
    return 'Other';
}

// LEVEL 1 — show types present in the data
function renderTypeView(locations) {
    currentView = "type";
    selectedType = null;
    selectedFacility = null;

    const container = document.getElementById("view-container");
    container.innerHTML = "";

    // figure out which types are present
    const present = new Set();
    locations.forEach(l => present.add(detectType(l.FacilityName)));

    const types = Array.from(present);

    types.forEach(type => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6';
        const card = document.createElement('div');
        card.className = 'card p-5 text-center h-100';
        card.style.cursor = 'pointer';
        card.innerHTML = `<h3>${type}</h3>`;
        card.addEventListener('click', () => renderFacilityView(type, locations));
        col.appendChild(card);
        container.appendChild(col);
    });
}

// LEVEL 2 — show distinct facilities for the chosen type (State, Lied, Beyer, etc.)
function renderFacilityView(type, locations) {
    currentView = "facility";
    selectedType = type;

    const container = document.getElementById("view-container");
    container.innerHTML = "";

    // filter by type using detectType
    const filtered = locations.filter(l => detectType(l.FacilityName) === type);

    // unique facility names
    const facilities = [...new Set(filtered.map(l => l.FacilityName))];

    facilities.forEach(facility => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';
        const card = document.createElement('div');
        card.className = 'card p-4 text-center h-100';
        card.style.cursor = 'pointer';
        card.innerHTML = `<h5>${facility}</h5>`;
        card.addEventListener('click', () => renderRoomView(facility, locations));
        col.appendChild(card);
        container.appendChild(col);
    });

    addBackButton(() => renderTypeView(locations));
}

// LEVEL 3 — show rooms for a facility (Court 3, Freeweight area, etc.)
function renderRoomView(facility, locations) {
    currentView = "room";
    selectedFacility = facility;

    const container = document.getElementById("view-container");
    container.innerHTML = "";

    const rooms = locations.filter(l => l.FacilityName === facility);

    rooms.forEach(location => {
        const percentFull = Math.round((location.LastCount / location.TotalCapacity) * 100);
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card shadow-sm h-100 p-3">
                <h6 class="text-muted mb-1">${location.FacilityName}</h6>
                <h5>${location.LocationName}</h5>
                <p class="mb-1"><strong>${location.LastCount}</strong> / ${location.TotalCapacity}</p>
                <div class="progress" style="height: 8px;">
                    <div class="progress-bar ${getProgressBarColor(percentFull)}" style="width:${percentFull}%"></div>
                </div>
                <small class="mt-2 d-block">${percentFull}% full</small>
            </div>
        `;
        container.appendChild(col);
    });

    addBackButton(() => renderFacilityView(selectedType, locations));
}

// safe DOM-based back button (no string injection)
function addBackButton(callback) {
    const container = document.getElementById("view-container");
    // remove old back button if present
    const old = document.getElementById("back-row");
    if (old) old.remove();

    const backRow = document.createElement('div');
    backRow.id = "back-row";
    backRow.className = "col-12 mb-3";

    const btn = document.createElement('button');
    btn.className = "btn btn-outline-light";
    btn.textContent = "← Back";
    btn.addEventListener('click', callback);

    backRow.appendChild(btn);
    container.prepend(backRow);
}