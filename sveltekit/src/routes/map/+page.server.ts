import { GEOCODE_API_KEY } from "$lib/server/env";

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
    }
};