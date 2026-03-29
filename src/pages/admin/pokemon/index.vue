<template>
    <div class="h-screen">
        <div>
            <div class="tab-content">
                <AdminPages :pages="pagesByGame[GAMES.POKEMON]" />
            </div>
        </div>
    </div>

</template>

<script setup>
import AdminPages from '@/components/admin/AdminPages.vue';
import useAdmin from '@/composables/useAdmin';
import { GAMES } from '@/utils/constants';

const { pagesByGame } = useAdmin();

</script>

<style lang="scss" scoped>
.tab-content {
    @include flex(row, center, flex-start);
    gap: 10px;
    width: 100%;
}
</style>