// Initialize and add the map
function initMap() {
    // The location of Carlington Community Health Centre
    const carlington = { lat: 45.383539135902325, lng: -75.73337435906367 };
    // The map, centered at Carlington Community Health Centre
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 18,
      center: carlington,
    });

    // Add markers for community resources
    const locations = [
        { title: "St. Elizabeth Church", position: { lat: 45.387, lng: -75.733 } },
        { title: "Alexander Park", position: { lat: 45.389, lng: -75.735 } },
        { title: "Kehillat Beth Israel", position: { lat: 45.386, lng: -75.731 } },
        { title: "Carlington Community Health Centre", position: carlington }
    ];

    locations.forEach((location, index) => {
        const marker = new google.maps.Marker({
            position: location.position,
            map: map,
            title: location.title
        });

        // Add click event to each marker
        marker.addListener('click', () => {
            map.setCenter(location.position);
            map.setZoom(18);
        });

        // Add click event to each listing card
        const listingCard = document.querySelectorAll('.listing.card')[index];
        listingCard.addEventListener('click', () => {
            openOverlay();
        });
    });
}

// Add event listener to the search bar
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (e) => {
    const searchValue = e.target.value.toLowerCase();
    const listings = document.querySelectorAll('.listing');
    let found = false; // Flag to check if any listing is found
    listings.forEach((listing, index) => {
        const listingTitle = listing.querySelector('.listing-title').textContent.toLowerCase();
        if (listingTitle.includes(searchValue)) {
            listing.style.display = 'block';
            found = true; // Set flag to true if a listing is found
        } else {
            listing.style.display = 'none';
        }
    });
    // Show a message if no results are found
    if (!found) {
        alert("No results found.");
    }
});

// Add event listener to the category dropdown
const categoryDropdown = document.querySelector('.category-dropdown');
categoryDropdown.addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    const listings = document.querySelectorAll('.listing');
    listings.forEach((listing) => {
        if (selectedCategory === 'all' || listing.classList.contains(selectedCategory)) {
            listing.style.display = 'block';
        } else {
            listing.style.display = 'none';
        }
    });
});

function openOverlay() {
    document.getElementById("overlay").style.display = "flex";
}

// Add event listeners for resizing
const overlay = document.getElementById("overlay");
overlay.style.resize = "both"; // Allow resizing
overlay.style.overflow = "auto"; // Allow scrolling if content overflows

function closeOverlay() {
    document.getElementById("overlay").style.display = "none";
}

// Close overlay when clicking outside of it
window.onclick = function(event) {
    const overlay = document.getElementById("overlay");
    if (event.target === overlay) {
        closeOverlay();
    }
}
