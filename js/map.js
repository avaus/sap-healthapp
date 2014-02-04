(function($, _) {
  "use strict";

  var map;
  var heatMaps = {};

  var helsinki = new google.maps.LatLng(60.171007, 24.941475);
  var keilaranta = new google.maps.LatLng(60.173702, 24.828844);
  var leppavaara = new google.maps.LatLng(60.219220, 24.812193);
  var pasila = new google.maps.LatLng(60.198328, 24.934115);

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

 function createHeatMap(data) {
    var points = _.map(data, function(arr) { return { weight: 10, location: new google.maps.LatLng(arr[0], arr[1]) }; });
    return new google.maps.visualization.HeatmapLayer({ data: points });
  }

  function clearHeatMaps() {
    _.forOwn(heatMaps, function(value, key) {
      value.setMap(null);
    });
  }

  function switchHeatMap(key, label) {
    clearHeatMaps();

    if (!heatMaps[key]) {
      $.getJSON("data/"+key+".json")
        .done(function(result) {
          heatMaps[key] = createHeatMap(result.data);
        })
        .fail(function() {
          heatMaps[key] = createRandomHeatMap(helsinki, 0.03, 50 + Math.random() * 200);
        })
        .always(function() {
          heatMaps[key].setMap(map);
        })

    } else {
      heatMaps[key].setMap(map);
    }

    $('#diseaseLabel').html(label);
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
  }

 

  $(document).ready(function() {
    $('.disease-picker').click(function() {
      console.log("Selecting " + $(this).html());
      switchHeatMap($(this).data('disease'), $(this).html());
    });
  
    initializeMap();
    switchHeatMap('lice', 'Lice');
  });

})(window.jQuery, window._);
