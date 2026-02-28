// TEMP
console.log("app.js loaded");

let previousLocations = null;

document.addEventListener("DOMContentLoaded", () => {
    fetchLocations();
    setInterval(fetchLocations, 30000); // 300000 = 5min
});

async function fetchLocations() {
    try {
        // Fetch data
        const response = await fetch('/api/locations');
        const locations = await response.json();

        // Compare new data with old to check if update is necessary
        if (previousLocations && JSON.stringify(locations) === JSON.stringify(previousLocations)) {
            console.log("No changes detected. Skipping re-render");
            return;
        }
        console.log("Data changed. Updating UI.")
        previousLocations = locations;

        // Find the empty HTML div
        const container = document.getElementById('locations-container');
        container.innerHTML = ''; // Clear it out just in case

        // Loop through data
        locations.forEach(location => {

            // How full room is as %
            const percentFull = Math.round((location.LastCount / location.TotalCapacity) * 100);

            const cardElement = document.createElement('div');
            cardElement.className = 'col-12 col-md-6 col-lg-4';

            // HTML variables
            cardElement.innerHTML = `
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h6 class="text-muted mb-1">${location.FacilityName}</h6>
                        <h5 class="card-title">${location.LocationName}</h5>
                        <p class="card-text mb-1">
                            <strong>${location.LastCount}</strong> / ${location.TotalCapacity} people
                        </p>
                        <div class="progress" style="height: 10px;">
                            <div class="progress-bar ${getProgressBarColor(percentFull)}"
                                 role="progressbar"
                                 style="width: ${percentFull}%"
                                 aria-valuenow="${percentFull}" aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(cardElement);
        });

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Progress bar color
function getProgressBarColor(percent) {
    if (percent < 50) return 'bg-success';
    if (percent < 80) return 'bg-warning';
    return 'bg-danger';
}