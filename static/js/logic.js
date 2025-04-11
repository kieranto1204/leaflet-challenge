// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map


// Create the map object with center and zoom options.
let myMap = L.map("map", {
  center: [0, 0],
  zoom: 5
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(myMap);

// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {

    return{
      opacity: 1,
      weight: 0.5,
      color: "black",
      fillOpacity: 0.75,
      fillColor: getColor(feature.geometry.coordinates[2]),
      getRadius: getRadius(feature.properties.mag)
    };

  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {

    if (depth > 100) {
      return "darkred";
    }

    if (depth > 80) {
      return "darkorange";
    }

    if (depth > 60) {
      return "yellow";
    }

    if (depth > 40) {
      return "lightgreen"
    }

    if (depth > 20) {
      return "green"
    }

    else {
      return "blue";
    }

  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {

    if (magnitude !== 0) {
      return magnitude * 3
    }

    else {
      return 1;
    }

  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {

      return L.circleMarker(latlng);

    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {

      layer.bindPopup(
        `<h3>Location: ${feature.properties.place}</h3>
        <hr><p>Magnitude: ${feature.properties.mag}</p>
        <p>Depth: ${feature.geometry.coordinates[2]} km</p>`
      )

    }
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(myMap);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    div.innerHTML = "<h3>Depth (km)</h3>";

    // Initialize depth intervals and colors for the legend
    const depth = [0, 20, 40, 60, 80, 100];
    const colors = [
      "blue", "green", "lightgreen", "yellow", "darkorange", "darkred"
    ]

    for (let i = 0; i < depth.length; i++) {

      // Creating label
      let label = `${depth[i]}`;
      if (depth[i + 1]) {
        label += ` - ${depth[i + 1]}`
      }
      else {
        label += `+`
      }

      // Generating colored square and adding a label
      div.innerHTML += `<i style="background:${colors[i]}; border: 1px solid #000;
      width: 18px; height: 18px; display: inline-block;"></i>
      ${label}<br>`;
    }

    // Styling the legend box
    div.style.padding = "10px";
    div.style.border = "2px solid black";
    div.style.borderRadius = "5px";
    div.style.backgroundColor = "white";
    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(myMap)});