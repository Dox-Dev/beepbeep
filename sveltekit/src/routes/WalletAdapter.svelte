<script lang="ts">
	import { onMount } from 'svelte';
	import { clusterApiUrl } from '@solana/web3.js';
	import {
		workSpace,
		WalletProvider,
		WalletMultiButton,
		ConnectionProvider
	} from '@aztemi/svelte-on-solana-wallet-adapter-ui';

	const localStorageKey = 'walletAdapter';
	const network = clusterApiUrl('devnet'); // localhost or mainnet

	let wallets;

	onMount(async () => {
		const {
		PhantomWalletAdapter,
		//SlopeWalletAdapter,
		SolflareWalletAdapter,
		//SolletExtensionWalletAdapter,
		TorusWalletAdapter,
		} = await import('@solana/wallet-adapter-wallets');

		const walletsMap = [
			new PhantomWalletAdapter(),
			//new SlopeWalletAdapter(),
			new SolflareWalletAdapter(),
			//new SolletExtensionWalletAdapter(),
			new TorusWalletAdapter(),
		];

		wallets = walletsMap;
	});
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect />
<ConnectionProvider {network} />
<WalletMultiButton />