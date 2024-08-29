<script lang="ts">
    import { fromLonLat, toLonLat } from 'ol/proj';
    import Map from "ol/Map";
    import View from "ol/View";
    import TileLayer from "ol/layer/Tile";
    import XYZ from "ol/source/XYZ";
    import { onMount } from "svelte";

    const enum map_themes {
        LIGHT_MODE =  "https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        DARK_MODE = "https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    };
    const centerCoord = [121.0685, 14.6539]; // longitude, latitude
    const zoom = 15;

    let mapElement: HTMLElement;
    let mountedMap: Map;
    onMount(() => {
        mountedMap = new Map({
            target: mapElement,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: map_themes.DARK_MODE,
                    }),
                }),
            ],
            view: new View({
                center: fromLonLat(centerCoord),
                zoom,
            }),
        });
    });
</script>

<div bind:this={mapElement} 
    class="relative top-0 left-0 h-dvh w-screen" />
