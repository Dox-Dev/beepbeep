<script lang="ts">
    import { fromLonLat } from "ol/proj";
    import Map from "ol/Map";
    import View from "ol/View";
    import TileLayer from "ol/layer/Tile";
    import XYZ from "ol/source/XYZ";
    import { onMount, onDestroy } from "svelte";
    import { Draw } from "ol/interaction";
    import { LineString } from "ol/geom";
    import { Vector as VectorLayer } from "ol/layer";
    import VectorSource from "ol/source/Vector";
    import { Style, Stroke } from "ol/style";
    import { Feature } from "ol";
    import type { Coordinate } from "ol/coordinate";

    const enum map_themes {
        LIGHT_MODE = "https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        DARK_MODE = "https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    }

    const centerCoord = [121.0685, 14.6539]; // longitude, latitude
    const zoom = 15;

    let mapElement: HTMLElement;
    export let mountedMap: Map;
    let vectorSource: VectorSource;
    let savedRoutes: Array<Coordinate[]> = [];

    // Accept routes as a prop
    export let routes: Array<Coordinate[]> = [];

    onMount(() => {
        vectorSource = new VectorSource(); // Initialize the vector source

        mountedMap = new Map({
            target: mapElement,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: map_themes.DARK_MODE,
                    }),
                }),
                new VectorLayer({
                    // Vector layer for routes
                    source: vectorSource,
                    style: new Style({
                        stroke: new Stroke({
                            color: "orange",
                            width: 4,
                        }),
                    }),
                }),
            ],
            view: new View({
                center: fromLonLat(centerCoord),
                zoom,
            }),
        });

        // Draw interaction for drawing lines
        const draw = new Draw({
            source: vectorSource,
            type: "LineString",
        });

        mountedMap.addInteraction(draw); // Draw interaction

        // Event listener for when a feature is added
        draw.on("drawend", (event) => {
            const feature = event.feature;
            const geometry = feature.getGeometry() as LineString;

            // Save the coordinates of the drawn route
            savedRoutes.push(geometry.getCoordinates() as Coordinate[]);
            console.log("Saved route coordinates:", savedRoutes);
        });

        // Draw the incoming routes
        drawRoutes(routes);
    });

    // Function to draw routes on the map
    function drawRoutes(routes: Array<Coordinate[]>) {
        if (!Array.isArray(routes)) {
            console.error("Routes must be an array");
            return;
        }

        routes.forEach((route) => {
            if (route.length > 0 && Array.isArray(route[0])) {
                const lineString = new LineString(route);
                const feature = new Feature({
                    geometry: lineString,
                });
                vectorSource.addFeature(feature); // Add the feature to the vector source
            } else {
                console.warn("Invalid route format, skipping:", route);
            }
        });
    }

    // Clean up on component destroy
    onDestroy(() => {
        if (mountedMap) {
            mountedMap.setTarget(undefined); // Use undefined instead of null
        }
    });
</script>

<div bind:this={mapElement} class="relative top-0 left-0 h-dvh w-screen" />
