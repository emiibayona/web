<template>
    <div class="h-screen">
        <div>
            <h1 class="text-2xl font-bold mb-5">Panel de Admin</h1>

            <Tabs :tabs="tabs" :active-tab="activeTab" @change="val => activeTab = val.index" id="tabs">
                <div class="tab-content">
                    <AdminPages :pages="tabs[activeTab]?.pages" />
                </div>
            </Tabs>


        </div>
    </div>

</template>

<script setup>
import { computed, ref, } from 'vue';

import Tabs from "@/components/atomic/Tabs.vue";
import { useRouter } from 'vue-router';
import { GAMES } from '@/utils/constants';
import AdminPages from '@/components/admin/AdminPages.vue';

const router = useRouter();

const activeTab = ref(0);

const info = {
    magic: [{ path: "admin/magic/collection", button: "Colección" },
    { path: "admin/magic/ventas", button: "Ventas de singles" },
    { path: "admin/sellado?game=magic", button: "Panel de Sellados" },
    { path: "admin/magic/binders", button: "Panel de Binders" }],
    pokemon: [{ path: "admin/sellado?game=pokemon", button: "Panel de Sellados" }],
    yugioh: [{ path: "admin/sellado?game=yugioh", button: "Panel de Sellados" }],
    riftbound: [{ path: "admin/sellado?game=riftbound", button: "Panel de Sellados" }]
}
const tabs = computed(() => {
    const games = Object.values(GAMES).map((x, index) => {
        const pages = info[x] || []
        return {
            index,
            game: x,
            name: x,
            pages,
            count: pages.length
        }
    })
    return games;
})
</script>

<style lang="scss" scoped>
.tab-content {
    @include flex(row, center, flex-start);
    gap: 10px;
    width: 100%;
}
</style>