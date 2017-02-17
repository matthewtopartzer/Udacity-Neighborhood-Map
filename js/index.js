      var map = null;

      var gmarkers = [];

      var mgr = [];

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 34.6883708, lng: -118.1204984},
          zoom: 11,
      });

        var locations = [
        {title: 'Winco Foods',
        location: {lat: 34.673870, lng: -118.147384}
        },
        {title: 'Lancaster Library',
        location: {lat: 34.698629, lng: -118.140206}
        },
        {title: 'In And Out',
        location: {lat: 34.704953, lng: -118.166825}
        },
        {title: 'AV Prison (For Bad People)',
        location: {lat: 34.693622, lng: -118.227907}
        },
        {title: 'Antelope Valley College',
        location: {lat: 34.677061, lng: -118.186852}
        }];

        var largeInfowindow = new google.maps.InfoWindow();

        for (var i = 0; i < locations.length; i++) {
          var position = locations[i].location;
          var title = locations[i].title;
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });
          gmarkers.push(marker);
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
        }
        document.getElementById('show-listings').addEventListener('click', showListings);
        document.getElementById('hide-listings').addEventListener('click', hideListings);
      }

      function triggerClick(i) {
            google.maps.event.trigger(gmarkers[i],"click");
}

      function populateInfoWindow(marker, infowindow) {
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });


      var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
          function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
          }
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          infowindow.open(map, marker);
        }
      }


      function showListings() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < gmarkers.length; i++) {
          gmarkers[i].setMap(map);
          bounds.extend(gmarkers[i].position);
        }
        map.fitBounds(bounds);
      }

      function hideListings() {
        for (var i = 0; i < gmarkers.length; i++) {
          gmarkers[i].setMap(null);
        }
      }

