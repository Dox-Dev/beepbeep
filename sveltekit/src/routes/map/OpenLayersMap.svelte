<script lang="ts">
    import Map from "ol/Map";
    import View from "ol/View";
    import TileLayer from "ol/layer/Tile";
    import VectorLayer from "ol/layer/Vector"; // For drawing the route
    import VectorSource from "ol/source/Vector"; // Source for the vector layer
    import LineString from "ol/geom/LineString"; // For route geometry
    import Feature from "ol/Feature"; // Feature class
    import { Stroke, Style } from "ol/style"; // For styling the route
    import XYZ from "ol/source/XYZ";
    import { fromLonLat } from "ol/proj"; // For converting coordinates
    import { onMount } from "svelte";
    import Draw from "ol/interaction/Draw"; // Importing Draw interaction

    const enum map_themes {
        LIGHT_MODE = "https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        DARK_MODE = "https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    }

    let mapElement: HTMLElement;
    let mountedMap: Map;
    let vectorSource = new VectorSource(); // Create a vector source for the drawn features
    let vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
            stroke: new Stroke({
                color: "blue", // Change to desired color
                width: 3,
            }),
        }),
    });

    export let startCoords: [number, number] | null = null; // Coordinates for starting location
    export let endCoords: [number, number] | null = null; // Coordinates for destination location

    onMount(() => {
        mountedMap = new Map({
            target: mapElement,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: map_themes.DARK_MODE,
                    }),
                }),
                vectorLayer, // Add vector layer to the map
            ],
            view: new View({
                center: fromLonLat([121.0583, 14.6091]), // Adjust to center the map
                zoom: 12, // Adjust zoom level as needed
            }),
        });

        // Add draw interaction for line strings
        const draw = new Draw({
            source: vectorSource,
            type: "LineString",
        });

        mountedMap.addInteraction(draw);

        // Optional: Handle draw end event
        draw.on("drawend", (event) => {
            const feature = event.feature; // Access the drawn feature
            console.log("Feature drawn:", feature);
        });
    });

    // Function to fetch and display route
    async function fetchRoute() {
        if (startCoords && endCoords) {
            const url = `http://localhost:5000/route/v1/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?overview=full`;
            const response = await fetch(url);
            const routeData = await response.json();

            if (routeData.routes.length > 0) {
                const route = routeData.routes[0].geometry.coordinates;
                const lineString = new LineString(route);
                const feature = new Feature(lineString);
                vectorSource.addFeature(feature); // Add the route to the vector layer
            }
        }
    }
</script>

<div bind:this={mapElement} class="relative top-0 left-0 h-dvh w-screen" />
