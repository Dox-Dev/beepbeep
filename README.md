# beepbeep

Arweave link: https://ugrgpbllajdbusfkpndackskeczkbrdxfvx47igtfs5e4yxmizda.arweave.net/oaJnhWsCRhpIqntGASpKILKgxHctb8-g0yy6TmLsRkY/

## Tech Stack
* Backend/Frontend: [Sveltekit](https://kit.svelte.dev/)
* Component library: [Flowbite Svelte](https://flowbite-svelte.com/), [Tabler Icons](https://tabler.io/icons)
* Package Manager: pnpm (just use [corepack](https://www.npmjs.com/package/corepack) for this)
* Extra functions: [OpenLayers](https://openlayers.org/) (we use OpenStreetMap and this to make the map), [Free Geocoding API](https://geocode.maps.co/) (we use this for taking coordinates and spewing a location name, or vice-versa; requires you to have an account to get an API key), [Dragon Deploy](https://dragondeploy.xyz/docs) (deploying to Arweave)

## Basic Commands 
```sh
# move into the `sveltekit` directory
cd sveltekit

# install dependencies
pnpm install

# run the website locally
pnpm dev

# build the website (places files in the `build` folder)
pnpm build
```

## Environment Variables
`.env` is to be placed in the `sveltekit` folder, and will contain the following environment variables:
```
GEOCODE_API_KEY="insertapikeyhere123"

VITE_ARWEAVE_PORT=1984
VITE_ARWEAVE_PROTOCOL=http
VITE_ARWEAVE_HOST=localhost
```
`mywallet.json` is also to be placed in the `sveltekit` folder, and will contain the JSON object of the private key to your Arweave wallet.
```
{<wallet-private-key-here>}
```

## Problems Faced
- Arweave routing is a pain as it appends the transaction ID of the uploaded website to the URI itself (i.e., `https://abcdefghijklmn.arweave.net/transactionID/<routes>`).
- Even if it does redirect to the right URI (either via writing it manually in the website or editing existing HTML in the deployed website), Arweave refuses to load parts of the site.
- Arweave requires static websites, which limits what we could do with our site.
