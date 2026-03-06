<template>
    <div class="w-[75%]">
        <div class="pages">
            <!-- <div v-for="(page, index) in pages" class="" :key="`${page.game}-${index}`">
                {{ page }}
            </div> -->
            <Button v-for="(page, index) in pages" :key="`admin-bp-${index}`" size="block-xy" @click="goTo(page.path)">
                {{ page.button }}
            </Button>
            <!-- <Button size="block-xy">
                HI
            </Button>
            <Button size="block-xy">
                HI
            </Button> -->
        </div>
    </div>
</template>

<script setup>
import Button from '@/components/atomic/Button.vue';
import { useRouter } from 'vue-router';

defineProps({ pages: { type: Array, default: () => [] } })
const router = useRouter();
function goTo(path) {
    router.push(path)
}
</script>

<style lang="scss" scoped>
.pages {
    @include grid(3, 150px, 40px);
}
</style>