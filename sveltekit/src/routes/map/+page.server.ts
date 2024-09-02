import { GEOCODE_API_KEY } from "$lib/server/env";
import { page } from "$app/stores";
import { get } from 'svelte/store';

interface OSRMRoute {
    geometry: {
        coordinates: number[][]; // Array of coordinates for the route
        type: string; // e.g., "LineString"
    };
    legs: Array<{
        distance: number; // Distance of the leg in meters
        duration: number; // Duration of the leg in seconds
        steps: Array<{
            distance: number; // Distance of the step
            duration: number; // Duration of the step
            instruction: string; // Instruction for the step
            maneuver: { // Maneuver details
                type: string; // e.g., "turn"
                location: number[]; // [longitude, latitude]
            };
        }>;
    }>;
    distance: number; // Total distance of the route
    duration: number; // Total duration of the route
}

interface RouteResponse {
    success: boolean;
    route?: OSRMRoute; // Optional since it may not be present if there's an error
    message?: string; // Optional message for errors
}

export const actions = {
    searchLocation: async ({ request }) => {
        // wait for form to be submitted
        const data = await request.formData();

        // get geocode response in json
        const search_query = data.get("search_input");
        const url = `https://geocode.maps.co/search?api_key=${GEOCODE_API_KEY}&q=${search_query}`;
        const geocode_http_response = await fetch(url);
        const geocode_json = await geocode_http_response.json();

        // return geocode_json to +page.svelte
        return {
            success: true,
            geocode_json: geocode_json,
        };
    },

    getRoute: async ({ request }): Promise<RouteResponse> => {
        const data = await request.json(); // Parse the incoming JSON request

        let startCoords = data.selectedSource;
        let endCoords = data.selectedDestination;

        let baseUrl = get(page).url.host; // Get the base URL for your OSRM server
        const osrmUrl = `http://${baseUrl}/route/v1/foot/${startCoords};${endCoords}?overview=full&geometries=geojson&steps=true`;

        const osrm_http_response = await fetch(osrmUrl);
        const routeData = await osrm_http_response.json(); // Parse the response as JSON

        if (routeData.routes.length > 0) {
            return {
                success: true,
                route: routeData.routes[0] as OSRMRoute, // Cast the route to OSRMRoute type
            };
        } else {
            return {
                success: false,
                message: "No route found.",
            };
        }
    }
};

