<script lang="ts">
    import { page } from '$app/stores';
    import "../app.css";
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
    import WalletAdapter from "./WalletAdapter.svelte";
    //import ConnectWallet from "./ConnectWallet.svelte";

    let transactionId = "";
    
    let page_url = $page.url.pathname.split('/');

    $: transactionId = (page_url.length > 1) ? ((page_url[0] !== "map" || page_url[0] !== "login") ? page_url[0] : "") : "";
    $: console.log(page_url);
    $: console.log(transactionId);

    </script>

<Navbar>
    <NavBrand href={`${transactionId}/`}>
        <!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Beepbeep</span>
    </NavBrand>

    <NavHamburger/>

    <NavUl>
        <NavLi href={`${transactionId}/`}>Home</NavLi>
        <NavLi href={`${transactionId}/map`}>Map</NavLi>
        <NavLi href={`${transactionId}/login`}>Login</NavLi>
        <WalletAdapter/>
    </NavUl>
</Navbar>