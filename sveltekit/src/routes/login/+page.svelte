<script>
    import BeepbeepLogo from "./BeepbeepLogo.svelte";
    import { Button, Card, Input } from "flowbite-svelte";
    import { IconBrandFacebookFilled, IconBrandGoogleFilled, IconBrandXFilled } from "@tabler/icons-svelte";

    let socmed_buttons_shown_first = true;
    function switch_login_views() {
        socmed_buttons_shown_first = !socmed_buttons_shown_first;
    }
</script>

<!-- Logo + Name -->
<BeepbeepLogo/>

<!-- Let's get started -->
<h1 class="mt-10 text-white text-center text-4xl">
    Let's get started!
</h1>

<!--
    Sign in 
    - SocMed Options
    - --- OR ---
    - Sign in with Password
-->

<!-- `absolute m-auto left-0 right-0` is used for horizontally centering the card. -->
<Card class="absolute m-auto left-0 right-0 mt-4">
    <div class="grid space-y-4 mx-10">
        <h5 class="text-xl text-center tracking-tight text-gray-900 dark:text-white">Sign in</h5>
        {#if socmed_buttons_shown_first}
            <Button size="sm" color="light"><IconBrandFacebookFilled class="mr-2"/>Continue with Facebook</Button>
            <Button size="sm" color="light"><IconBrandGoogleFilled class="mr-2"/>Continue with Google</Button>
            <Button size="sm" color="light"><IconBrandXFilled class="mr-2"/>Continue with Twitter</Button>
        {:else}
            <Input type="email" placeholder="Username, Email, or Phone number" required />
            <div class="grid space-y-1">
                <Input type="password" placeholder="Password" required />
                <span class="text-xs text-right">Forgot Password?</span>
            </div>
            <Button size="sm" class="mt-10">Sign in</Button>
        {/if}
        <div class="my-8"/> <!-- extra vertical space -->

        <div class="inline-flex items-center justify-center w-full">
            <hr class="w-64 h-px bg-gray-200 border-0 dark:bg-gray-700"/>
            <span class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">OR</span>
        </div>

        <div class="grid space-y-1 !mt-6">
            {#if socmed_buttons_shown_first}
                <Button size="sm" class="mt-6 mb-2" on:click={switch_login_views}>Sign in with password</Button>
            {:else}
                <div class="flex justify-center gap-2 mb-2">
                    <Button pill={true} color="light" class="!p-2"><IconBrandFacebookFilled/></Button>
                    <Button pill={true} color="light" class="!p-2"><IconBrandGoogleFilled/></Button>
                    <Button pill={true} color="light" class="!p-2"><IconBrandXFilled/></Button>
                </div>
            {/if}
            <h5 class="text-xs text-center tracking-tight">
                Don't have an account?
                <span class="text-orange-300">
                    <a href="/">Sign up</a>
                </span>
            </h5>
        </div>
    </div>
</Card>