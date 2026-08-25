// Map Initialization with Mapbox & Leaflet Fallback
document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  const coordinates = (typeof listing !== 'undefined' && listing.geometry && listing.geometry.coordinates)
    ? listing.geometry.coordinates
    : [77.2090, 28.6139]; // Default: [lng, lat]

  const title = (typeof listing !== 'undefined' && listing.title) ? listing.title : "Listing Location";
  const locationText = (typeof listing !== 'undefined' && listing.location) ? `${listing.location}, ${listing.country || ''}` : "Exact location provided after booking";

  // Try Mapbox first if token is available
  if (typeof mapToken !== 'undefined' && mapToken && mapToken.trim() !== '' && typeof mapboxgl !== 'undefined') {
    try {
      mapboxgl.accessToken = mapToken;
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coordinates,
        zoom: 12
      });

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl());

      // Add custom marker
      const marker = new mapboxgl.Marker({ color: '#ff385c' })
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px;">
              <strong style="color: #222; font-size: 0.95rem;">${title}</strong>
              <p style="color: #717171; font-size: 0.8rem; margin: 4px 0 0 0;">${locationText}</p>
            </div>
          `)
        )
        .addTo(map);

      // Window helper to change style
      window.changeStyle = function(styleName) {
        map.setStyle('mapbox://styles/mapbox/' + styleName + '-v11');
      };
      return;
    } catch (e) {
      console.log('Mapbox init failed, falling back to Leaflet:', e.message);
    }
  }

  // Fallback: Leaflet + OpenStreetMap
  if (typeof L !== 'undefined') {
    const lat = coordinates[1];
    const lng = coordinates[0];

    const map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Custom red pin icon
    const customIcon = L.divIcon({
      className: 'custom-leaflet-pin',
      html: `<div style="background-color: #ff385c; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;"><i class="fa-solid fa-house" style="font-size: 0.85rem;"></i></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    L.marker([lat, lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<strong>${title}</strong><br><span style="color:#666; font-size:0.85rem;">${locationText}</span>`)
      .openPopup();

    window.changeStyle = function(styleName) {
      // Leaflet style switch
      showToast('Map style updated');
    };
  }
});
