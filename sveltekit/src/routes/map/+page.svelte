<script lang="ts">
    import { enhance } from '$app/forms';
    import map_icon from '../../lib/assets/map_icon.svg';

    import { Avatar, Button, ButtonGroup, Card, Dropdown, DropdownItem, Input } from "flowbite-svelte";
    import { IconMapPinFilled } from "@tabler/icons-svelte";
    import { IconArrowLeft, IconArrowsUpDown, IconCircleFilled, IconShape, IconDotsVertical, IconPlus, IconWallet } from "@tabler/icons-svelte";

    import Map from "ol/Map";
    import Feature from "ol/Feature";
    import { fromLonLat, toLonLat } from 'ol/proj';
    import Icon from 'ol/style/Icon.js';
    import Point from "ol/geom/Point";
    import Style from 'ol/style/Style.js';
    import VectorSource from "ol/source/Vector";
    import VectorLayer from "ol/layer/Vector";

    import OpenLayersMap from "./OpenLayersMap.svelte";

    // allows +page.svelte to access results of form actions
    export let form;

    // allows this file to access mountedMap in OpenLayersMap.svelte
    export let mountedMap:Map;

    const BUTTON_GRID = {
        "Restaurant": "resto-icon",
        "Gym": "gym-icon",
        "Hospital": "hospital-icon",
        "Mall": "mall-icon",
        "Pet Shop": "pet-icon",
        "Beach": "beach-icon",
        "Library": "library-icon",
        "See more": "seemore-icon",
    }

    // Create a style for the marker
	const mapPinIconStyle = new Style({
		image: new Icon({
		    width: 20,
		    height: 20,
		    src: map_icon
	    })
	});

    let sourceLayer = new VectorLayer();
    let destinationLayer = new VectorLayer();

    function check_if_layer_is_in_map(layer: VectorLayer) {
        const isLayerExistsInMap = mountedMap.getLayers().getArray().includes(layer);
        return isLayerExistsInMap;
    }

    function put_pin_on_map(pin_type:string, location_name:string, lat: string, long:string) {
        if(pin_type == "source") {
            // remove existing source layer if already in use
            if(check_if_layer_is_in_map(sourceLayer)) mountedMap.removeLayer(sourceLayer);

            // make map pin and put in vector source
            let map_pin_feature = new Feature({
                    geometry: new Point(
                        fromLonLat([Number(long),Number(lat)])
                    ),
                    style: mapPinIconStyle,
                    name: location_name
                }
            );
            const sourceSource = new VectorSource({features:[map_pin_feature]});

            // apply vector source to destination layer
            // then apply destination layer to map
            sourceLayer.setSource(sourceSource);
            mountedMap.addLayer(sourceLayer);
            console.log("added source pin");
        } else {
            // remove existing destination layer if already in use
            if(check_if_layer_is_in_map(destinationLayer)) mountedMap.removeLayer(destinationLayer);

            // make map pin and put in vector source
            let map_pin_feature = new Feature({
                    geometry: new Point(
                        fromLonLat([Number(long),Number(lat)])
                    ),
                    style: mapPinIconStyle,
                    name: location_name
                }
            );
            const destinationSource = new VectorSource({features:[map_pin_feature]});

            // apply vector source to destination layer
            // then apply destination layer to map
            destinationLayer.setSource(destinationSource);
            mountedMap.addLayer(destinationLayer);
            console.log("added destination pin");
        }
    }

    let source_location_first = true;

    function switch_location_inputs() {
        source_location_first = !source_location_first;
        console.log(source_location_first);
    }

    let is_searching_source = false;
    let is_searching_destination = false;

    function show_search_card(location: string) {
        if(location=="source") {
            is_searching_source = true;
            is_searching_destination = false;
            console.log("source");
        } else {
            is_searching_source = false;
            is_searching_destination = true;
            console.log("destination");
        }
    }

    function disable_search_card() {
        is_searching_source = false;
        is_searching_destination = false;
        console.log("disabling search card");
    }

</script>

<div class="overflow-hidden h-screen relative flex z-0">
    <OpenLayersMap bind:mountedMap/>

    <div class="grid grid-cols-2">
        <!-- Top left drawer-->
        <Button size="xs" color="light" class="absolute left-4 top-4"><IconShape/></Button>
        <Dropdown>
            <DropdownItem>Dashboard</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Earnings</DropdownItem>
            <DropdownItem slot="footer">Sign out</DropdownItem>
        </Dropdown>

        <!-- Top right button group -->
        <ButtonGroup class="*:!ring-primary-700 absolute right-4 top-4">
            <Button size="xs">
                <div class="flex space-x-4 rtl:space-x-reverse">
                    <Avatar size="xs" src="https://s3-alpha.figma.com/hub/file/4338730091/25fd46ec-d7b2-4052-830e-674d22fe7f8c-cover.png" />
                </div>
            </Button>
            <Button size="xs" color="light" disabled >1020</Button>
            <Button size="xs" color="light"><IconPlus/></Button>
            <Button size="xs" color="primary"><IconWallet/></Button>
        </ButtonGroup>
    </div>


    <!--
        Buttom navigation card with:
        + start/end point
        + current location buttons
        + suggested travel destination
        + popup search card when searching for locations (source/destination)
    -->
    {#if is_searching_source || is_searching_destination}
    <Card class="absolute m-auto bottom-4 left-0 right-0 mt-4">
        <div class="grid grid-cols-[1fr_5fr_1fr] mb-8 mx-2">
            <button on:click={disable_search_card}>
                <IconArrowLeft class="" />
            </button>

            <div></div>
            <button class="text-end">
                Done
            </button>
        </div>

        <div class="grid grid-cols-[1fr_3fr] mb-8">
            <div>
                <Button pill={true} class="!w-fit !h-fit !p-2" ><IconCircleFilled class="h-4 w-4" /></Button>
            </div>
            <div>
                <form method="POST" action="?/searchLocation" use:enhance>
                    {#if is_searching_source}
                        <Input name="search_input" id="large-input" size="sm" placeholder="Choose a starting location" />
                    {:else if is_searching_destination}
                        <Input name="search_input" id="large-input" size="sm" placeholder="Where to? Choose destination" />
                    {/if}
                </form>
            </div>
        </div>

        {#if form?.success}
            {#each form?.geocode_json as location}
                <Button color="light" on:click={()=>{put_pin_on_map(is_searching_source ? "source" : "destination", location.display_name, location.lat, location.lon)}}>{location.display_name}</Button>
            {/each}
        {/if}
    </Card>
    {:else}
    <Card class="absolute m-auto bottom-4 left-0 right-0 mt-4">
        <div class="grid grid-cols-[1fr_3fr_1fr] mb-8">
            <!-- Left side -->
            <div class="grid grid-rows-3 justify-center">
                <Button pill={true} class="!w-fit !h-fit !p-2" ><IconMapPinFilled class="h-4 w-4" /></Button>
                <div class="!w-fit !h-fit !p-2"> <IconDotsVertical class="w-4 h-4" /> </div>
                <Button pill={true} class="!w-fit !h-fit !p-2"><IconCircleFilled class="h-4 w-4" /></Button>
            </div>

            <!-- Middle side -->
            <div class="grid grid-rows-3">
                {#if source_location_first}
                <Button pill={true} color="alternative" size="xs" on:click={() => show_search_card("destination")}>
                    <div class="text-xs">
                        <span>Where to?</span>
                        <span>Choose destination</span>
                    </div>
                </Button>
                <div></div>
                <Button pill={true} color="alternative" size="xs" on:click={() => show_search_card("source")}>
                    <div class="text-xs">
                        <span>Choose starting location</span>
                    </div>
                </Button>
                {:else}
                <Button pill={true} color="alternative" size="xs">
                    <div class="text-xs">
                        <span>Choose starting location</span>
                    </div>
                </Button>
                <div></div>
                <Button pill={true} color="alternative" size="xs">
                    <div class="text-xs">
                        <span>Where to?</span>
                        <span>Choose destination</span>
                    </div>
                </Button>
                {/if}
            </div>

            <!-- Right side -->
            <div class="grid grid-rows-3">
                <div></div>
                <button on:click={switch_location_inputs}> <IconArrowsUpDown on:click={switch_location_inputs} class="h-4 w-4" /> </button>
                <div></div>
            </div>
        </div>

        <div class="inline-flex items-center justify-center w-full mb-4">
            <hr class="w-full h-px bg-gray-200 border-0 dark:bg-gray-700"/>
        </div>

        <div>
            Suggested Travel Destinations
        </div>

        <div class="grid grid-rows-2 grid-cols-4">
            {#each Object.entries(BUTTON_GRID) as [name, icon]}
            <div class="grid grid-rows-2">
                <Button color="alternative" size="xs">{icon}</Button>
                {name}
            </div>
            {/each}
        </div>
    </Card>
    {/if}

</div>