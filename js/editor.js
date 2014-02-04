(function($, _) {
  "use strict";

  var helsinki = new google.maps.LatLng(60.171007, 24.941475);
  var map;
  var heatMapPoints = [];
  var heatMapLayer = new google.maps.visualization.HeatmapLayer({ data: heatMapPoints });

  //placePoint(helsinki);

  function placePoint(latLng) {
      var weight = 10;
      heatMapPoints.push({ location: new google.maps.LatLng(latLng.lat(), latLng.lng()), weight: weight });
      heatMapLayer.setMap(map);
  }

  function initializeMap() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: helsinki,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      panControl: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false
    });

    google.maps.event.addListener(map, "click", function (e) {
      placePoint(e.latLng);
    });

    heatMapLayer.setMap(map);
  }

  $(document).ready(function() {  
    initializeMap();
    $('#exportBtn').click(function() {
      var points = _.map(heatMapPoints, function(data) { return [data.location.lat(), data.location.lng()]; });
      alert(JSON.stringify(points));
    });
  });

})(window.jQuery, window._);
