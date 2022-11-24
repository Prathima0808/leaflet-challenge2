let myMap = L.map("map", {
    center: [-30.8, 130.9],
    zoom: 3
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

 // Define a markerSize() function that will give each city a different radius based on its population.
    function markerSize(mag) {
    return Math.sqrt(mag) * 50;
  }
  
  
  // Use this link to get the GeoJSON data.
  let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  // Getting our GeoJSON data
  d3.json(link).then(function(data) {

    function styleInfo(feature){
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
          };
      
    }

    function getColor(depth){
        switch (true) {
            case depth > 90:
              return "#ea2c2c";
            case depth > 70:
              return "#ea822c";
            case depth > 50:
              return "#ee9c00";
            case depth > 30:
              return "#eecc00";
            case depth > 10:
              return "#d4ee00";
            default:
              return "#98ee00";
          }
      
    }

    function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
    
        return magnitude * 4;
      }

      
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,
        // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            "Magnitude: "
            + feature.properties.mag
            + "<br>Depth: "
            + feature.geometry.coordinates[2]
            + "<br>Location: "
            + feature.properties.place
          );
        }
      }
    ).addTo(myMap);
    // console.log(data.features);

    var legend = L.control({
        position: "bottomright"
      });

    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
    
        var grades = [-10, 10, 30, 50, 70, 90];
        var colors = [
          "#98ee00",
          "#d4ee00",
          "#eecc00",
          "#ee9c00",
          "#ea822c",
          "#ea2c2c"
        ];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
              + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
          }

        return div;
    };
      
        // Finally, we our legend to the map.
    legend.addTo(myMap);
      
    

  });