function initMap() {
  // const map = new google.maps.Map(document.getElementById('map'));
  const map = new google.maps.Map(document.getElementById("map"), {
    gestureHandling: "greedy",
  });

  const bounds = new google.maps.LatLngBounds(); //create empty LatLngBounds object
  const infoWindow = new google.maps.InfoWindow();  
  
  // make GET request to the API to get data
  $.ajax({
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      data.features.forEach(incident => {
        const lng = incident.geometry.coordinates[0];
        const lat = incident.geometry.coordinates[1];
        const location = incident.properties.place;
        const date = new Date(incident.properties.time).toUTCString();

        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
          title: '<h4>'+location+'<br>'+date+'</h4>'
        });

        //extend the bounds to include each marker's position
        bounds.extend(marker.position);

        // Add a click listener for each marker, and set up the info window.
        marker.addListener("click", () => {
          infoWindow.close();
          infoWindow.setContent(marker.getTitle());
          infoWindow.open(marker.getMap(), marker);
        });
      })
    }
  });

  //now fit the map to the newly inclusive bounds
  map.fitBounds(bounds);

  //(optional) restore the zoom level after the map is done scaling
  const listener = google.maps.event.addListener(map, "idle", function () {
      map.setZoom(3);
      google.maps.event.removeListener(listener);
  });

}

// for responsive height resizing
google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, "resize", function() {
 var center = map.getCenter();
 google.maps.event.trigger(map, "resize");
 map.setCenter(center); 
});