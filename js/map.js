(function($, _) {
  "use strict";

  var map;
  var heatMaps = {};

  var $diseaseSelect;

  var helsinki = new google.maps.LatLng(60.171007, 24.941475);
  var keilaranta = new google.maps.LatLng(60.173702, 24.828844);
  var leppavaara = new google.maps.LatLng(60.219220, 24.812193);
  var pasila = new google.maps.LatLng(60.198328, 24.934115);


  var diseasePreSets = {
    'ebola': [leppavaara, 0.02, 100],
    'aids': [keilaranta, 0.001, 200],
    'commoncold': [helsinki, 0.05, 1000]
  }

  /**
   * Spread should be 0.001 -> 0.05 or some such
   */
  function createRandomData(latLng, spread, cnt) {
    var result = [];

    for (var i=0; i<cnt; i++) {
      var weight = 0.5 + Math.random() * 10;
      var offsetLat = -spread/2 + spread * Math.random();
      var offsetLon = -spread/2 + spread * Math.random();
      result.push({location: new google.maps.LatLng(latLng.lat() + offsetLat, latLng.lng() + offsetLon), weight: weight})
    }

    return result;
  }

  function createRandomHeatMap(latLng, spread, cnt) {
    var heatMapData = createRandomData(latLng, spread, cnt);
    return new google.maps.visualization.HeatmapLayer({ data: heatMapData });
  }

  function clearHeatMaps() {
    _.forOwn(heatMaps, function(value, key) {
      value.setMap(null);
    });
  }

  function switchHeatMap(key) {
    clearHeatMaps();

    if (!heatMaps[key]) {
      if (diseasePreSets[key]) {
        heatMaps[key] = createRandomHeatMap.apply(this, diseasePreSets[key]);
      } else {
        heatMaps[key] = createRandomHeatMap(helsinki, 0.03, 50 + Math.random() * 200);
      }
    } 

    heatMaps[key].setMap(map);

    if (diseasePreSets[key]) {
      map.panTo(diseasePreSets[key][0]);
    }
  }

  function initializeMap() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: helsinki,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      panControl: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false
    });
  }

  $(document).ready(function() {
    $diseaseSelect = $('.disease-select');
    $diseaseSelect.change(function() {
      switchHeatMap($diseaseSelect.val());
    });
  
    initializeMap();
    switchHeatMap($diseaseSelect.val());
  });

})(window.jQuery, window._);
