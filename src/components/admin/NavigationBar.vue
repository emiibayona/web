<template>
    <nav class="ml-[110px] h-[100px] flex items-center space-x-2 text-lg font-medium">
        <!-- <router-link to="/" class="hover:font-bold hover:text-black transition">Home</router-link> -->

        <div class="absolute top-0 left-0 p-4 z-50 hover:scale-125 transition-all duration-300 ease-out">
            <a href="/"><img src='/images/ico.png' class="h-16 w-auto " /></a>
        </div>

        <div v-for="(crumb, index) in breadcrumbs" :key="crumb.url" class="flex items-center">
            <span v-if="index > 0" class="mx-2 text-zinc-600 text-bold">/</span>

            <router-link v-if="!crumb.isLast" :to="crumb.url"
                class="hover:text-black hover:font-bold transition capitalize">
                {{ crumb.name }}
            </router-link>

            <span v-else
                class=" underline underline-offset-4 decoration-[3px] decoration-yellow-500 decoration-slice font-bold capitalize">
                {{ crumb.name }}
            </span>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
    const pathArray = route.path.split('/').filter((path) => path !== '');

    return pathArray.map((path, index) => {
        const url = '/' + pathArray.slice(0, index + 1).join('/');
        return {
            name: path.charAt(0).toUpperCase() + path.slice(1),
            url: url,
            isLast: index === pathArray.length - 1
        };
    });
});
</script>
