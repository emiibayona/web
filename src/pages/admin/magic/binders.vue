<template>
    <h1 class="text-2xl font-bold mb-5 ml-8">Panel de Admin > Magic > Binders</h1>
    <div class="justify-self-center w-1/2">
        <div class="grid grid-cols-3 gap-4 items-center flex-wrap">
            <div v-for="(binder, index) in bindersMapped" :key="binder.id" class="w-full binder">
                <!-- {{ binder }} -->
                <Tags tag="Nombre" :value="binder.name" />
                <Tags tag="Actualizada" :value="new Date(binder.updatedAt).toLocaleString()" />

                <div class="w-full h-[100px] flex flex-row gap-4 mt-4">
                    <Button size="block-xy" wrap="normal" @click="openCollection(binder)">Revisar en colección</Button>
                    <Button size="block-xy" wrap="normal" @click="openSingles(binder)">Link a venta de singles</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Button from '@/components/atomic/Button.vue';
import Tags from '@/components/atomic/Tags.vue';
import useCollection from '@/composables/mtg/useCollection';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const { binders, fetchBinders } = useCollection();
const router = useRouter();
const route = useRoute();

const bindersMapped = computed(() => {
    if (!binders.value || !binders.value.length) return [];
    const init = [binders.value[0]]
    return binders.value.length > 1 ? [...init, ...binders.value.slice(1).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))] : init
})
const openCollection = (binder) => {
    router.push(`/admin/magic/collection?binder=${binder.id}`)
}
const openSingles = (binder) => {
    router.push(`/magic/singles?binder=${binder.id}`)
}

onMounted(async () => {
    await fetchBinders(import.meta.env.VITE_SELLER_COLLECTION_ID);
})
</script>

<style lang="scss" scoped>
.binder {
    padding: 12px;
    border-radius: 12px;
    background: rgba(55, 49, 49, 0.3);
    @include flex(column, flex-start, flex-start);
    gap: 4px;

}
</style>