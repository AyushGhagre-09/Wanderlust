


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('listingForm');
  if (!form) return;
   let isAutoSubmitting = false;
  form.addEventListener('submit', async (e) => {
    if(isAutoSubmitting)return;
    e.preventDefault();

    const locationName = document.getElementById('locationName').value;
    if (!locationName) {
      return;
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lon;
      }

      isAutoSubmitting = true;
      form.requestSubmit();

    } catch (error) {
      isAutoSubmitting = true;
      form.requestSubmit();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
   const mapElement = document.getElementById('map');
  if (!mapElement) return; 
  var map = L.map('map').setView([latitude,longitude], 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  var marker = L.marker([latitude,longitude]).addTo(map);
  marker.bindPopup(`<h6>Exact location provided after booking</h6>`).openPopup();

});