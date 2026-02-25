<template>
    <div v-if="adminUser">
        <h1 class="text-2xl font-bold mb-5">Panel de Admin</h1>

        <Tabs :tabs="tabs" :active-tab="activeTab" @change="val => activeTab = val.index" id="tabs">
            <div class="tab-content">
                <AdminPages :pages="tabs[activeTab]?.pages" />
            </div>
        </Tabs>


    </div>
    <AdminLogin />
</template>

<script setup>
import { computed, ref, } from 'vue';

import Tabs from "@/components/atomic/Tabs.vue";
import { useRouter } from 'vue-router';
import AdminLogin from '@/components/admin/AdminLogin.vue';
import { GAMES } from '@/utils/constants';
import useUser from '@/composables/useUser';
import AdminPages from '@/components/admin/AdminPages.vue';

const router = useRouter();

const { adminUser } = useUser();
const activeTab = ref(0);

const tabs = computed(() => {
    const games = Object.values(GAMES).filter(x => x === "magic").map((x, index) => ({
        index,
        game: x,
        name: x,
        pages: [{ path: "admin/magic/ventas", button: "Ventas" }, { path: "admin/magic/collection", button: "Colleccion" },]

    }))
    return games;
})

function goHome() {
    router.push("/");
}

</script>

<style lang="scss" scoped>
.tab-content {

    // overflow-y: auto;
    @include flex(row, center, flex-start);
    gap: 10px;
    width: 100%;


    // @include breakpoint(hd1) {
    //     height: 400px;
    // }

    // @include breakpoint(fhd) {
    //     height: 600px;
    // }

    // @include breakpoint(fhd3) {
    //     height: 900px;
    // }

}
</style>