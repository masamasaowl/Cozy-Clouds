console.log("map route is functional");

// Initialize and add the map
let map;

async function initMap(latitude, longitude) {
    //  destination 
    const position = { lat: latitude, lng: longitude};
  
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  
    // The map   
    map = new Map(document.getElementById("map"), {
      zoom: 18,
      center: position,
      mapId: "DEMO_MAP_ID",
    });
  
    // The marker
    const marker = new AdvancedMarkerElement({
      map: map,
      position: position,
      title: "Destination",
    });
}

initMap(listingCoordinates[1], listingCoordinates[0]);